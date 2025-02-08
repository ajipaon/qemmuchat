// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.4
// 	protoc        v3.6.1
// source: model.proto

package pb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type CreateRoomReq struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name          string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *CreateRoomReq) Reset() {
	*x = CreateRoomReq{}
	mi := &file_model_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *CreateRoomReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreateRoomReq) ProtoMessage() {}

func (x *CreateRoomReq) ProtoReflect() protoreflect.Message {
	mi := &file_model_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreateRoomReq.ProtoReflect.Descriptor instead.
func (*CreateRoomReq) Descriptor() ([]byte, []int) {
	return file_model_proto_rawDescGZIP(), []int{0}
}

func (x *CreateRoomReq) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *CreateRoomReq) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type CreateRoomRes struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Success       bool                   `protobuf:"varint,1,opt,name=success,proto3" json:"success,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *CreateRoomRes) Reset() {
	*x = CreateRoomRes{}
	mi := &file_model_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *CreateRoomRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreateRoomRes) ProtoMessage() {}

func (x *CreateRoomRes) ProtoReflect() protoreflect.Message {
	mi := &file_model_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreateRoomRes.ProtoReflect.Descriptor instead.
func (*CreateRoomRes) Descriptor() ([]byte, []int) {
	return file_model_proto_rawDescGZIP(), []int{1}
}

func (x *CreateRoomRes) GetSuccess() bool {
	if x != nil {
		return x.Success
	}
	return false
}

type JoinRoomReq struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	RoomId        string                 `protobuf:"bytes,1,opt,name=roomId,proto3" json:"roomId,omitempty"`
	ClientId      string                 `protobuf:"bytes,2,opt,name=clientId,proto3" json:"clientId,omitempty"`
	Content       []byte                 `protobuf:"bytes,3,opt,name=content,proto3" json:"content,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *JoinRoomReq) Reset() {
	*x = JoinRoomReq{}
	mi := &file_model_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *JoinRoomReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*JoinRoomReq) ProtoMessage() {}

func (x *JoinRoomReq) ProtoReflect() protoreflect.Message {
	mi := &file_model_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use JoinRoomReq.ProtoReflect.Descriptor instead.
func (*JoinRoomReq) Descriptor() ([]byte, []int) {
	return file_model_proto_rawDescGZIP(), []int{2}
}

func (x *JoinRoomReq) GetRoomId() string {
	if x != nil {
		return x.RoomId
	}
	return ""
}

func (x *JoinRoomReq) GetClientId() string {
	if x != nil {
		return x.ClientId
	}
	return ""
}

func (x *JoinRoomReq) GetContent() []byte {
	if x != nil {
		return x.Content
	}
	return nil
}

type JoinRoomRes struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Content       []byte                 `protobuf:"bytes,1,opt,name=content,proto3" json:"content,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *JoinRoomRes) Reset() {
	*x = JoinRoomRes{}
	mi := &file_model_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *JoinRoomRes) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*JoinRoomRes) ProtoMessage() {}

func (x *JoinRoomRes) ProtoReflect() protoreflect.Message {
	mi := &file_model_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use JoinRoomRes.ProtoReflect.Descriptor instead.
func (*JoinRoomRes) Descriptor() ([]byte, []int) {
	return file_model_proto_rawDescGZIP(), []int{3}
}

func (x *JoinRoomRes) GetContent() []byte {
	if x != nil {
		return x.Content
	}
	return nil
}

var File_model_proto protoreflect.FileDescriptor

var file_model_proto_rawDesc = string([]byte{
	0x0a, 0x0b, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x02, 0x70,
	0x62, 0x22, 0x33, 0x0a, 0x0d, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x52, 0x6f, 0x6f, 0x6d, 0x52,
	0x65, 0x71, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02,
	0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x29, 0x0a, 0x0d, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65,
	0x52, 0x6f, 0x6f, 0x6d, 0x52, 0x65, 0x73, 0x12, 0x18, 0x0a, 0x07, 0x73, 0x75, 0x63, 0x63, 0x65,
	0x73, 0x73, 0x18, 0x01, 0x20, 0x01, 0x28, 0x08, 0x52, 0x07, 0x73, 0x75, 0x63, 0x63, 0x65, 0x73,
	0x73, 0x22, 0x5b, 0x0a, 0x0b, 0x4a, 0x6f, 0x69, 0x6e, 0x52, 0x6f, 0x6f, 0x6d, 0x52, 0x65, 0x71,
	0x12, 0x16, 0x0a, 0x06, 0x72, 0x6f, 0x6f, 0x6d, 0x49, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x06, 0x72, 0x6f, 0x6f, 0x6d, 0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x63, 0x6c, 0x69, 0x65,
	0x6e, 0x74, 0x49, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x63, 0x6c, 0x69, 0x65,
	0x6e, 0x74, 0x49, 0x64, 0x12, 0x18, 0x0a, 0x07, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x18,
	0x03, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x07, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x22, 0x27,
	0x0a, 0x0b, 0x4a, 0x6f, 0x69, 0x6e, 0x52, 0x6f, 0x6f, 0x6d, 0x52, 0x65, 0x73, 0x12, 0x18, 0x0a,
	0x07, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x07,
	0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x32, 0x73, 0x0a, 0x0b, 0x43, 0x68, 0x61, 0x74, 0x53,
	0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x32, 0x0a, 0x0a, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65,
	0x52, 0x6f, 0x6f, 0x6d, 0x12, 0x11, 0x2e, 0x70, 0x62, 0x2e, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65,
	0x52, 0x6f, 0x6f, 0x6d, 0x52, 0x65, 0x71, 0x1a, 0x11, 0x2e, 0x70, 0x62, 0x2e, 0x43, 0x72, 0x65,
	0x61, 0x74, 0x65, 0x52, 0x6f, 0x6f, 0x6d, 0x52, 0x65, 0x73, 0x12, 0x30, 0x0a, 0x08, 0x4a, 0x6f,
	0x69, 0x6e, 0x52, 0x6f, 0x6f, 0x6d, 0x12, 0x0f, 0x2e, 0x70, 0x62, 0x2e, 0x4a, 0x6f, 0x69, 0x6e,
	0x52, 0x6f, 0x6f, 0x6d, 0x52, 0x65, 0x71, 0x1a, 0x0f, 0x2e, 0x70, 0x62, 0x2e, 0x4a, 0x6f, 0x69,
	0x6e, 0x52, 0x6f, 0x6f, 0x6d, 0x52, 0x65, 0x73, 0x28, 0x01, 0x30, 0x01, 0x42, 0x2e, 0x5a, 0x2c,
	0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x61, 0x6a, 0x69, 0x70, 0x61,
	0x6f, 0x6e, 0x2f, 0x71, 0x65, 0x6d, 0x6d, 0x75, 0x43, 0x68, 0x61, 0x74, 0x2f, 0x71, 0x65, 0x6d,
	0x6d, 0x75, 0x2f, 0x6d, 0x6f, 0x64, 0x75, 0x6c, 0x65, 0x2f, 0x70, 0x62, 0x62, 0x06, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x33,
})

var (
	file_model_proto_rawDescOnce sync.Once
	file_model_proto_rawDescData []byte
)

func file_model_proto_rawDescGZIP() []byte {
	file_model_proto_rawDescOnce.Do(func() {
		file_model_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_model_proto_rawDesc), len(file_model_proto_rawDesc)))
	})
	return file_model_proto_rawDescData
}

var file_model_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_model_proto_goTypes = []any{
	(*CreateRoomReq)(nil), // 0: pb.CreateRoomReq
	(*CreateRoomRes)(nil), // 1: pb.CreateRoomRes
	(*JoinRoomReq)(nil),   // 2: pb.JoinRoomReq
	(*JoinRoomRes)(nil),   // 3: pb.JoinRoomRes
}
var file_model_proto_depIdxs = []int32{
	0, // 0: pb.ChatService.CreateRoom:input_type -> pb.CreateRoomReq
	2, // 1: pb.ChatService.JoinRoom:input_type -> pb.JoinRoomReq
	1, // 2: pb.ChatService.CreateRoom:output_type -> pb.CreateRoomRes
	3, // 3: pb.ChatService.JoinRoom:output_type -> pb.JoinRoomRes
	2, // [2:4] is the sub-list for method output_type
	0, // [0:2] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_model_proto_init() }
func file_model_proto_init() {
	if File_model_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_model_proto_rawDesc), len(file_model_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_model_proto_goTypes,
		DependencyIndexes: file_model_proto_depIdxs,
		MessageInfos:      file_model_proto_msgTypes,
	}.Build()
	File_model_proto = out.File
	file_model_proto_goTypes = nil
	file_model_proto_depIdxs = nil
}
