FROM golang:1.17-alpine as builder

WORKDIR /home

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build

EXPOSE 80

CMD [ "./create-board" ]

FROM alpine

WORKDIR /app

COPY --from=builder /home/*.ttf ./
COPY --from=builder /home/templates ./templates
COPY --from=builder /home/create-board ./

CMD [ "./create-board" ]
