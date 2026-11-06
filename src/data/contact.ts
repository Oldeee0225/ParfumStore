// Datos de contacto de la tienda: cámbialos solo aquí.
export const WHATSAPP_NUMBER = '50763570383'
export const WHATSAPP_DISPLAY = '+507 6357-0383'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const INSTAGRAM_URL = 'https://www.instagram.com/elegant_parfum_pty?srtk=ZDk2NTg4anFpdjEx'
export const TIKTOK_URL = 'https://www.tiktok.com/@elegantparfumc4?_r=1&_t=ZS-9BAZteVun3c'

export const whatsappLink = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`
