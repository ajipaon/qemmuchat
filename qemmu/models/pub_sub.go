package models

import (
	"fmt"
	"sync"
)

type Broker struct {
	subscribers map[string]chan string
	mu          sync.RWMutex
}

func NewBroker() *Broker {
	return &Broker{
		subscribers: make(map[string]chan string),
	}
}

func (b *Broker) Subscribe(id string) chan string {
	b.mu.Lock()
	defer b.mu.Unlock()

	ch := make(chan string)
	b.subscribers[id] = ch
	return ch
}

func (b *Broker) Unsubscribe(id string) {
	b.mu.Lock()
	defer b.mu.Unlock()

	if ch, ok := b.subscribers[id]; ok {
		close(ch)
		delete(b.subscribers, id)
	}
}

func (b *Broker) Publish(id, message string) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	if ch, ok := b.subscribers[id]; ok {
		select {
		case ch <- message:
		default:
			fmt.Printf("Subscriber %s is not ready to receive messages\n", id)
		}
	}
}
