# TAB web app

Semester VI of IT studies on Silesian University of Science and Technology

## Development in Docker

1. Setup backend URI
In file `src/settings.ts`, change value of `backendURI` to match your API URL.

2. Build image:
```shell
docker build -t tab-web-app .
```

3. Run container:
```shell
docker run -d -p 8081:8080 tab-web-app:latest
```
