# RabbitMQ

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


