package main

import (
	"encoding/json"
	"fmt"
	"github.com/ajipaon/qemmuChat/qemmu/module/logs"
	"github.com/ajipaon/qemmuChat/qemmu/module/webpush"
	"github.com/ajipaon/qemmuChat/qemmu/routes"
	"log"
	"net"
	"os"
	"strconv"

	_ "github.com/ajipaon/qemmuChat/docs"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type GlobalConfig struct {
	sessionName string "json:session_name"
}

func NewGlobalConfig() *GlobalConfig {
	return &GlobalConfig{
		sessionName: "qemmu_session",
	}
}

var globalConfig = NewGlobalConfig()

var configs struct {
	grcpServer      *grpc.Server
	grpcKeepAlive   bool
	tlsStrictMaxAge string
	tlsRedirectHTTP string
	tlsEnabled      bool
	TLS             json.RawMessage
	grcpActive      bool
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// @title Swagger QemmuChat API
// @version 1.0
// @description This is a Swagger QemmuChat API
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {

	godotenv.Load()
	os.Setenv("session_name", globalConfig.sessionName)
	dbFile := os.Getenv("DB_PATH")
	portGrpc := getEnv("GRCP_PORT", "50051")
	keepAlive, err := strconv.ParseBool(getEnv("GRCP_KEEP_ALIVE", "true"))
	if err != nil {
		configs.grpcKeepAlive = keepAlive
	}
	activeGrcp, err := strconv.ParseBool(getEnv("GRCP_ACTVE", "false"))
	if err != nil {
		configs.grcpActive = activeGrcp
	}
	tlsEnabledStr := getEnv("TLS_ENABLED", "false")
	if tlsEnabled, err := strconv.ParseBool(tlsEnabledStr); err != nil {
		configs.tlsEnabled = tlsEnabled
	}

	dblite, err := gorm.Open(sqlite.Open(dbFile), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	err = webpush.AutoMigrate(dblite)

	if err != nil {
		logs.Err.Println("Failed to migrate DB: %v", err.Error())
	}

	if configs.grcpActive {
		go func() {
			lis, err := net.Listen("tcp", ":50051")
			if err != nil {
				log.Fatalf("failed to listen: %v", err)
			}

			tlsConfig, err := parseTLSConfig(configs.tlsEnabled, configs.TLS)
			if err != nil {
				logs.Err.Fatalln(err)
			}

			if configs.grcpServer, err = serveGrpc(portGrpc, configs.grpcKeepAlive, tlsConfig); err != nil {
				logs.Err.Fatal(err)
			}

			if os.Getenv("ENV") == "dev" {
				reflection.Register(configs.grcpServer)
			}
			log.Println("gRPC server is running on port 50051...")
			if err := configs.grcpServer.Serve(lis); err != nil {
				log.Fatalf("failed to serve: %v", err)
			}
		}()
	}

	if err == nil {
		vapidKey, _ := webpush.InitVapidKeys(dblite)
		os.Setenv("VAPID_PUBLIC_KEY", vapidKey.PublicKey)
		os.Setenv("VAPID_PRIVATE_KEY", vapidKey.PrivateKey)
	}
	webpush.GetInstanceWithDB(dblite).RegisterListeners()
	e := routes.Routing(dblite)
	err = e.Start(fmt.Sprintf(":%d", 8080))
	if err != nil {
		return
	}
}
