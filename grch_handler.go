package main

import (
	"context"
	"crypto/tls"
	"github.com/ajipaon/qemmuChat/qemmu/module"
	"github.com/ajipaon/qemmuChat/qemmu/module/logs"
	"github.com/ajipaon/qemmuChat/qemmu/module/pb"
	"github.com/ajipaon/qemmuChat/qemmu/module/socket"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"net"
	"strings"
	"time"
)

var grpcConfig struct {
	maxMessageSize int64
}

func authInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "metadata not foud")
	}

	authHeader, ok := md["authorization"]
	if !ok || len(authHeader) == 0 {
		return nil, status.Errorf(codes.Unauthenticated, "token not found")
	}

	token := strings.TrimPrefix(authHeader[0], "Bearer ")

	claims, err := module.ValidateJWT(token)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "token not valid: %v", err.Error())
	}

	ctx = context.WithValue(ctx, "id", claims.Id)

	return handler(ctx, req)
}

func serveGrpc(addr string, kaEnabled bool, tlsConf *tls.Config) (*grpc.Server, error) {
	if addr == "" {
		return nil, nil
	}

	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, err
	}

	secure := ""
	var opts []grpc.ServerOption
	opts = append(opts, grpc.MaxRecvMsgSize(int(grpcConfig.maxMessageSize)))
	if tlsConf != nil {
		opts = append(opts, grpc.Creds(credentials.NewTLS(tlsConf)))
		secure = " secure"
	}

	if kaEnabled {
		kepConfig := keepalive.EnforcementPolicy{
			MinTime:             1 * time.Second,
			PermitWithoutStream: true,
		}
		opts = append(opts, grpc.KeepaliveEnforcementPolicy(kepConfig))

		kpConfig := keepalive.ServerParameters{
			Time:    60 * time.Second,
			Timeout: 20 * time.Second,
		}
		opts = append(opts, grpc.KeepaliveParams(kpConfig))
	}
	opts = append(opts, grpc.UnaryInterceptor(authInterceptor))

	srv := grpc.NewServer(opts...)
	pb.RegisterChatServiceServer(srv, socket.NewPbServerChat())
	logs.Info.Printf("gRPC/%s%s server is registered at [%s]", grpc.Version, secure, addr)

	go func() {
		if err := srv.Serve(lis); err != nil {
			logs.Err.Println("gRPC server failed:", err)
		}
	}()

	return srv, nil
}
