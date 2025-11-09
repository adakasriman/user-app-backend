Client / Frontend
        │
        ▼
┌────────────────────────────┐
│        ROUTER Layer        │  ← defines endpoints
└────────────────────────────┘
        │ calls
        ▼
┌────────────────────────────┐
│      CONTROLLER Layer      │  ← handles req/res, calls service
└────────────────────────────┘
        │ calls
        ▼
┌────────────────────────────┐
│        SERVICE Layer       │  ← contains business logic
└────────────────────────────┘
        │ calls
        ▼
┌────────────────────────────┐
│     REPOSITORY Layer       │  ← talks to DB
└────────────────────────────┘
        │ uses
        ▼
┌────────────────────────────┐
│        MODEL Layer         │  ← defines schema/entity
└────────────────────────────┘

DTO(Data Transfer Object): It is used to transfer data between layers.
gRPC: It is used to transfer data between services, type of api.
Redis: It is used to store data in memory, type of db.

Kafka: It is used to transfer data between services.

zookeeper: distributed tracing, service discovery, configuration management.

zipkin: distributed tracing(record requests and responses).

docker: containerization.

elastic scaling: horizontal scaling.


<!-- API call flow -->

when user calls api 

it calls router
router calls controller
controller calls service
service calls repository
repository calls model
