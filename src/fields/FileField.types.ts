import { FieldDefinition } from './field.static.types'

export const supportedFileTypes = [
    // Images
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/heic',

    // Video
    'video/mp4',
    'video/webm',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska', // .mkv

    // Audio
    'audio/mpeg', // .mp3
    'audio/wav',
    'audio/ogg',
    'audio/aac',

    // Documents
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'text/plain',
    'text/csv',
    'application/rtf',

    // Archives
    'application/zip',
    'application/x-tar',
    'application/x-7z-compressed',
    'application/x-rar-compressed',

    // Wildcards for broad support
    'image/*',
    'video/*',
    'audio/*',
    '*',
] as const

export type SupportedFileType = (typeof supportedFileTypes)[number]

export interface FileFieldValue {
    name: string
    id?: string
    type?: SupportedFileType
    uri?: string
    base64?: string
}

export type FileFieldDefinition = FieldDefinition<FileFieldValue> & {
    /** * .File - a great way to deal with file management */
    type: 'file'
    options?: {
        acceptableTypes: SupportedFileType[]
    }
}
