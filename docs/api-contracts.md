# API Contracts

## CEP Lookup Endpoint

**Endpoint:** `GET /backend/v1/cep-lookup/{cep}`
**Auth Required:** Yes
**Description:** Fetches structured address data for a given 8-digit CEP.

### Request

- **Path Parameter:** `cep` (string) - 8 digits, formatting characters like `-` are stripped automatically.

### Success Response (200 OK)

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "complemento": "lado ímpar",
  "bairro": "Sé",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

### Error Responses

- **400 Bad Request:** Inválid CEP format.
- **404 Not Found:** CEP not found in database.
- **503 Service Unavailable:** Remote service temporarily unavailable.

---

## PIS/PASEP Lookup Endpoint (Mock)

**Endpoint:** `GET /backend/v1/pis-lookup/{pis}`
**Auth Required:** Yes
**Description:** Simulates public data fetching for a PIS/PASEP number.

### Request

- **Path Parameter:** `pis` (string) - 10 to 11 digits, formatting stripped.

### Success Response (200 OK)

```json
{
  "pis": "12345678901",
  "status": "Ativo",
  "abono_salarial": true,
  "last_update": "2023-10-10T12:00:00Z"
}
```

### Error Responses

- **400 Bad Request:** Invalid PIS/PASEP format.
- **503 Service Unavailable:** Mock error scenario.
