# RabbitMQ

## Messages Properties

* content_type: describes mime-type encoding. i.e.: application/json
* reply_to: Used commonly to indicate a callback queue
* correlation_id (optional): Useful when working with Remote Procedure Call (RPC)
  * Use a unique value for every request
  * If the correlation_id value is unknown, it may gets safely discarded
  * It helps to prevent duplicate responses
* persistent: Mark a message as persistent
  *  The persistent property used to mark messages do not guarantee the messages will not be lost

## Exchange Types

### Direct Exchance

The direct exchange allows you to send messages directly to a queue using a binding key that matches the routing key.

* This exchange cannot do routing based on multiple criteria. 
  * Check Topic Exchange for this.

### Topic Exchance

The topic exchange is similar to the direct exchange; however, it allows for a multiple criteria for the routing key

For example, we can have ```<corporation>.<department>.<division>.<team>```.

If we wish to send messages to all cleaning teams of all departments, we would do:
```your_corporation_name.*.cleaning_division.*```

If we wish to send a message to everyone in the corporation, we could do:
```your_corporation_name.#```

* Messages can't have an arbitrary routing key (binding key) as in the Direct Exchange
* Routing keys:
  * must be a list of words, delimited by dots.
  * must used a start '*' to substitute exactly one word
  * must use a hash '#' to substitute zero or more words
    * Similar to Fanout Exchange, queues bound to the hash binding key will receive all the messages regardless of the routing key
* When start or hashes are not used in the bindings, the topic exchange behaves as a direct exchange.

### Headers Exchance

### Fanout Exchance

The fanout exchange makes sure to broadcast all the messages to all the queues binded to it.

* It is only capable of mindless broadcasting

## Bindings

We call bindings the relationships between exchanges and queues.
For exchanges such as the Fanout Exchange, we are required to create such bindings so the fanout knows which queues should be receving the messages.

* Bindings can have names
* In the Fanout Exchange, the binding name is ignored
* We refer to binding keys as Routing keys when working with exchanges such as Direct Exchange
* We can bind multiple queues with the same binding key
  * For example, in Direct Exchange, the exchange can use the same binding key (routing key) to ensure two or more queues receive the message.

## Subcribing

* We can create a new binding for each severity of message
  * This means that we can send info, error, warning messages to different queues based on the severity they have.

## Remote Procedure Call (RPC)

Run a function on a remote location (server) and wait for the result come back (to our client)

When doing a request message, the server needs to know which "callback" queue address the response message will go back.

* Avoid using RPC if possible. Its better to use an asynchronous pipeline.
  * RPC blocks
* Do not confuse the call to a local function with the remote one
* Make sure to have all your dependencies documented and clear
* Handle error cases such as timeouts and such


## Things to Have In Consideration

* RabbitMQ will not allow you to redefine an existing queue with different parameters
  * It may return an error to your applicatoin if you do that

### Durable

To increase the changes that a messages are not lost, mark both the queue and message as durable

### Persistent

To deal with RabbitMQ restarts, mark your messages as persistent.

* The persistent property used to mark messages do not guarantee the messages will not be lost
  * The property only indicates to RabbitMQ to store messages in the disk
  * Use 'publisher confirms' if you need a stronger guarantee

### Prefetch

Setting a channel with prefecth of value 1 tells RabbitMQ to not give more than one message to a worker at a time
  * RabbitMQ will not dispatch another message to a worker while the previous message has not being processed and acknowledged

### Temporary Queues using Exclusive Property

Temporary queues are queues created by RabbitMQ with a random name.
To create them, do not supply a name for the queue and set exclusive to true.

  * The random queue name will have this format: ```amq.gen-JzTY20BRgKO-HjmUJj0wLg```
  * We don't need to create a fresh, empty queue
  * When the consumer disconnect, the queue is automatically deleted
  

## RabbitMQ Tips

### Connections and Channels

* Keep your client libraries updated
* Don't create a huge amount of connections. It can impact performance.
  * Each connection will use:
    *  TCP buffer space
    *  RAM in RabbitMQ
    *  The RabbitMQ Management collects a lot of metrics per connection (and each channel)
 * Reuse connections
   * Preferently one connection per process
 * Use one channel per thread in your process
 * Use different connections for publishing and consuming. One connection for publishing and one connection for consuming
   * If you are publishing, this allows to deal with TCP back-pressure due big loads of TCP packages. If you are consuming in the same channel, on the same TCP connection, that connection may not receive the acknoledgments that you are publishing to the server. This will end in the server no be able to handle more messages. So, if you publish to fast, then there is a problem consuming later
 * Try not to open and close connections repeatedly since it may incur in latency.
   * The latency is due that open and closing connections requires TLS connection (around 5 TCP packages), AMQP opening connection (7 TCP packages), AMQP channel (2 TCP packages), AQMP publishing/consuming (1 TCP package), AMQP closing channel (2 TCP packages), and AMQP closing connection (2 TCP packages).

### Queues

* Make queues short so they can be fast
  * Try to limit your queue size.
    * Small queues don't need to hit the disk, just remain shortly in RAM. 
* If your queues are going to be large, then use 'lazy queue-mode' (available in RabbitMQ 3.6+)
  * It tells the server to not try to cache all messages
  * It will improbe memory performance
* Long queues can bring these problems:
  * Long sync times between nodes
  * Increase of time consumption when starting a server due messages
  * If queue mirroring is enabled, the time that gets to synchronize will take a long time. 
    * When synchronizing all the publishers and consumers are stopped for that queue.
* Set the Time-To-Live (TTL) for both queues and messages
  * If not set, there can be errors generated related with the RabbitMQ's queue index, in memory, which stores all messages to disk sequencially. This can generate a large queue index which gets paged out to disk and performance gets affected
  * It can be done per queue message, using a policy, using x-arguments during declaration, per messages in publishers, etc
* Queues are single-threaded 
* For maximum performance, keep one queue per core, so around 45,000+ messages per second depending of your hardware, etc
  * If you need more, you can split the queue into multiple queues; therefore, utilizing multiple cores
    * Check these plugins: rabbitmq-consistent-hash-exchange and rabbitmq-sharding 
* Its better to consume messages (push) than poll messages (pull). Consuming its more efficient than having the server push messages to your client.
* Better performance when you acknowleged (ack) and auto-ack every N messages than each message, where N is a defined number you can decided based on number of messages, by messages per time, etc
* Remember that RabbitMQ management does collect and store stats for all queues
* Keep number of queues low
* Set queues for auto-delete
  * This will prevent temporary queues to pile up

#### Messages

* Be aware of persistent messages
  * For a persisten message to persist and survive a server restart, there are four conditions it must be meet:
    * The exchange must be durable
    * The queue must be durable
    * The message itself must be persistent
    * All above conditions must be set on the client
* Use temporary or non durable queues for thoughtput messages.
  * They don't survive restart server
  * Mark them as non-durable and set them to auto delete
  * Temprary or nonverbal queues are faster than other queues

### Acknowledgment and Confirms

* Acknowledge messages when you have processed them.
  * In this way, if there is a disconnection, the message will be re-delivered again.
* If implementing publish confirm, have logic that for re-publishing if the publishing didn't work.
* At the comsumer side, make sure to reject the message if you have an exception or something ans such. This will allow for the possibility of re-consuming case.
* When using consumer acknoledgment, set the prefetch limits parameter for your channel.
  * Prefetch is used to specify how many messages are being sent to the consumer before the client has to acknowledge one.
  * If you don't setup the prefetch limit then server will send you messages from the queue very fast which could cause issues with RAM storage since there will reside all the unacknowledged messages causing out of memory exception; plus, possible cause of round-trip latency.
  * The math for an optimal prefetch is round-trip latency (RTL), divided by message processing time (MPT) plus one. Prefetch = RTL/(MPT + 1)
    * In this way the client doesn't have to wait for deliveries

### Clustering
 * Make sure to configure mirrored queues
 * Try to understand how partition handling modes works
 * Make sure your client reconects automatically
 * Control which node queues are created on and connect to them
 * Apply failover methods such as DNS load balancing (TTL), Load Balancer, and 
   * * For Load Balancer use PROXY protocol for RabbitMQ 3.7+)


