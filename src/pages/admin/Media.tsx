import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { storageApi } from '@/lib/api'
import { FiUpload, FiTrash2, FiFolder, FiImage } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function AdminMedia() {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: files } = useQuery({
    queryKey: ['media-files'],
    queryFn: () => storageApi.list('media'),
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const path = `uploads/${Date.now()}_${file.name}`
      await storageApi.upload('media', path, file)
      queryClient.invalidateQueries({ queryKey: ['media-files'] })
      toast.success('File uploaded')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (name: string) => {
    try {
      await storageApi.delete('media', name)
      queryClient.invalidateQueries({ queryKey: ['media-files'] })
      toast.success('File deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <>
      <Helmet><title>Media - ReelDB Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Media Library</h1>
          <p className="text-dark-400 text-sm mt-1">Upload and manage images</p>
        </div>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <FiUpload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files?.map((file: any) => (
          <div key={file.name} className="card group">
            <div className="relative aspect-square overflow-hidden bg-dark-800">
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media/${file.name}`}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(file.name)}
                  className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs text-dark-400 truncate">{file.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
