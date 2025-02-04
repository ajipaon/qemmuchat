package main

import (
	"crypto/tls"
	"encoding/json"
	"errors"
	"golang.org/x/crypto/acme/autocert"
	"strconv"
)

func parseTLSConfig(tlsEnabled bool, jsconfig json.RawMessage) (*tls.Config, error) {
	type tlsAutocertConfig struct {
		Domains   []string `json:"domains"`
		CertCache string   `json:"cache"`
		Email     string   `json:"email"`
	}

	type tlsConfig struct {
		Enabled      bool               `json:"enabled"`
		RedirectHTTP string             `json:"http_redirect"`
		StrictMaxAge int                `json:"strict_max_age"`
		Autocert     *tlsAutocertConfig `json:"autocert"`
		CertFile     string             `json:"cert_file"`
		KeyFile      string             `json:"key_file"`
	}

	var config tlsConfig

	if jsconfig != nil {
		if err := json.Unmarshal(jsconfig, &config); err != nil {
			return nil, errors.New("http: failed to parse tls_config: " + err.Error() + "(" + string(jsconfig) + ")")
		}
	}

	if !tlsEnabled && !config.Enabled {
		return nil, nil
	}

	if config.StrictMaxAge > 0 {
		configs.tlsStrictMaxAge = strconv.Itoa(config.StrictMaxAge)
	}

	configs.tlsRedirectHTTP = config.RedirectHTTP

	if config.Autocert != nil {
		certManager := autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(config.Autocert.Domains...),
			Cache:      autocert.DirCache(config.Autocert.CertCache),
			Email:      config.Autocert.Email,
		}
		return certManager.TLSConfig(), nil
	}

	cert, err := tls.LoadX509KeyPair(config.CertFile, config.KeyFile)
	if err != nil {
		return nil, err
	}

	return &tls.Config{Certificates: []tls.Certificate{cert}}, nil
}
