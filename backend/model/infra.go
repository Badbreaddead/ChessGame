package model

var ResponseStatuses = map[string]string {
	"success": "success",
	"error": "error",
	"failed": "failed",
}
var ResponseCodes = map[int]int {
	200: 200,
	400: 400,
	404: 404,
	500: 500,
}

type APIError struct {
    Status      int         `json:"status"`
    Code        string      `json:"code"`
    Title       string      `json:"title"`
    // Details     string      `json:"details"`
    // Href        string      `json:"href"`
}

func newAPIError(status int, code string, title *string) *APIError {
    return &APIError{
        Status:     status,
        Code:       code,
        Title:      *title,
    }
}

func ErrDatabase (title string) *APIError {
	return newAPIError(500, "database_error", &title)
}

func ErrServer (title string) *APIError {
	return newAPIError(500, "server_error", &title)
}

func ErrClientInput (title string) *APIError {
	return newAPIError(400, "bad_request_error", &title)
}

func Err404 (title string) *APIError {
	return newAPIError(404, "endpoint_not_found", nil)
}