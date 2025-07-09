# klickndone: E-Commerce Automation for Anxiety-Free Shopping

## Project Overview

klickndone is an automation tool designed to help people reduce anxiety associated with online shopping. Many individuals experience heightened stress, decision fatigue, and repetitive checking behaviors when making purchases online. This project aims to create a smoother, less anxiety-inducing experience through automation.

## How It Helps

For many people, the seemingly simple task of making an online purchase can become overwhelming due to:

- **Repetitive checking** of product details, reviews, and prices
- **Decision paralysis** when comparing similar items
- **Excessive verification** of payment details and order status
- **Anxiety about making "the wrong choice"**

klickndone addresses these challenges by:

1. **Automating the purchase flow**: Reducing the number of manual steps required
2. **Handling payment processes**: Limiting exposure to anxiety-triggering form fields
3. **Providing consistent experiences**: Creating predictability that can reduce uncertainty
4. **Reducing decision fatigue**: Streamlining the process with fewer interruptions

## Supported Platforms

Currently, the tool supports automation on:
- AliExpress
- MercadoLivre/MercadoLibre (WIP)

## How It Works

klickndone uses Playwright for browser automation and an Express server to provide an API interface. When given a product URL, it:

1. Opens the website in a controlled browser environment
2. Navigates through the purchase flow
3. Handles login/authentication when required
4. Manages payment selection and confirmation
5. Completes the order process

The system is designed to be robust against UI changes and to handle unexpected popups or form variations that might otherwise increase anxiety when encountered manually.

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- A running Chrome instance with remote debugging enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/thiagosanches/klickndone.git
cd klickndone

# Install dependencies
npm install

# Create and configure your .env file with required credentials
cp .env.example .env
```

### Running the Application

```bash
# Start Chrome with remote debugging (in a separate terminal)
google-chrome --remote-debugging-port=9222

# Start the automation server
npm start
```

### Making a Purchase

Send a GET request to the server with the product URL:

```bash
curl http://localhost:3000/buy/[domain]/[encoded-product-url]
```

## Privacy and Security

This tool is designed with privacy in mind. All sensitive information (payment details, login credentials) is stored locally in your `.env` file and is never shared with external services.

## Disclaimer

klickndone is a supportive tool and not a replacement for professional mental health treatment for anxiety-related concerns. It's designed to be used as part of a broader approach to managing anxiety during online shopping experiences. If you're struggling with significant anxiety, please consider seeking help from a qualified mental health professional.

## Contributing

Contributions that improve accessibility, reduce stress points in the shopping experience, or expand supported platforms are welcome. Please feel free to submit pull requests or open issues with suggestions.

## License

[MIT License](LICENSE)
# klickndone
# klicknd0ne
# klikndone
