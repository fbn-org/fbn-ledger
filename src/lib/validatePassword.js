const password = process.env.PASSWORD

export default function validatePassword(p) {
    return p === password
}