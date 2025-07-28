package mailer

import (
	"fmt"
	"os"

	"github.com/resendlabs/resend-go"
)

var client *resend.Client

func InitMailer() {
	client = resend.NewClient(os.Getenv("RESEND_API_KEY"))
}

// Call this in main.go before any sends
// mailer.InitMailer()

func SendResetEmail(toEmail string, resetToken string) error {
	frontendBaseURL := os.Getenv("FRONTEND_BASE_URL")
	if frontendBaseURL == "" {
		return fmt.Errorf("FRONTEND_BASE_URL environment variable is not set")
	}
	resetLink := fmt.Sprintf("%s/reset-password?token=%s", frontendBaseURL, resetToken)

	if os.Getenv("ENV") != "production" {
		fmt.Println("🔗 Password reset link:", resetLink)
	}

	params := &resend.SendEmailRequest{
		From:    "noreply@resend.dev", // use domainless sender until you have your own
		To:      []string{toEmail},
		Subject: "My App - Reset your password",
		Html:    fmt.Sprintf("<p>Click <a href='%s'>here</a> to reset your password.</p>", resetLink),
	}

	_, err := client.Emails.Send(params)
	return err
}
