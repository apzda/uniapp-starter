export const isH5 = process.env.UNI_PLATFORM === 'h5'
export const isApp = process.env.UNI_PLATFORM === 'app'
export const WeappTailwindcssDisabled = isH5 || isApp
export const isMp = !isH5 && !isApp