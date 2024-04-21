

export async function verifyCaptcha(key: String) {
    let response = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            secret: process.env.CAPTCHA_KEY,
            response: key
        })
    }).then(res => res.json());

    return response.success;
}