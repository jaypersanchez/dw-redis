# Overview

This project is the Redis Stream module implemented in NodeJS.  This module is the main engine that will feed data into the Redis Stream.  The data fed through this engine can come from many different sources.  Redis and Protocol Buffer from Google is used to deliver data from source to destination.  As of this current writing, this module is to feed a data warehouse.  But this is implemented where the source is irrelevant.  To setup and install the developer environment for this repo, refer to [DEVGUIDE](./DEVGUIDE.md) that is included in this repo.

## Endpoint URI

There are several standard URIs that is currently available but this list can grow in the near future as development and enhancements progresses.  Below is an example of how to feed data to the engine with different endpoints.

The following is the general URI:

```
http://localhost:8080/
```

The table below are currently available URI endpoints.  Expect that this will change pretty often as this data stream engine is being design and built in parallel.

| Endpoint URI | Description |
| :----------  | :---------- |
| `stream`     |  This endpoint takes a general data formatted string value to be stored in the DB stream and is not conforming with the protocol buffer (expected this to change)        |
| `district`   | This endpoint is specific to District office related data and is conforming with protocol buffer            |
| `local`      | This endpoint is specific to Local related data and is conforming with protocol buffer  **THIS IS NOT YET IMPLEMENTED**           |

To save data in Redis using the `stream` endpoint:

```
stream?stream={fieldA:datavalue, fieldB:datavalue}
```

Where **fieldA** or **fieldB** is the name of the field and **datavalue** is the value of the field.

For the endpoints `district` and `local` it is different from the stream.

```
district?id=1111&name=Pacific Northwest
```

The setting is the same for `local`



