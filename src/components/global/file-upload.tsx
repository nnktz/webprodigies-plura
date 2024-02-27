import Image from 'next/image'
import { File, X } from 'lucide-react'

import { UploadDropzone } from '@/lib/uploadthing'

import { Button } from '../ui/button'

type Props = {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subAccountLogo' | 'media'
  onChange: (url?: string) => void
  value?: string
}

export const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split('.').pop()

  if (value) {
    return (
      <div className="flex flex-col items-center justify-center gap-y-2">
        {type !== 'pdf' ? (
          <div className="relative h-40 w-40">
            <Image fill src={value} alt="uploaded image" className="object-contain" />
          </div>
        ) : (
          <div className="relative float-start mt-2 items-center rounded-md bg-background/10 p-2">
            <File />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
            >
              View PDF
            </a>
          </div>
        )}

        <Button variant={'ghost'} type="button" onClick={() => onChange('')}>
          <X className="mr-2 h-4 w-4" />
          Remove Logo
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url)
        }}
        onUploadError={(error: Error) => {
          console.log(error)
        }}
      />
    </div>
  )
}
