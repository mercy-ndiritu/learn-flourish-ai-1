import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploaded: boolean;
}

const FileUpload = ({ onClose }: { onClose: () => void }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      uploaded: false
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const file of newFiles) {
      try {
        // Get the actual File object
        const actualFile = Array.from(files).find(f => 
          f.name === file.name && formatFileSize(f.size) === file.size
        );
        
        if (!actualFile) continue;

        // Upload to Supabase storage
        const fileExt = actualFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('study-materials')
          .upload(fileName, actualFile);

        if (uploadError) throw uploadError;

        // Process the file with AI
        const { data, error } = await supabase.functions.invoke('process-file', {
          body: {
            file_name: actualFile.name,
            file_url: uploadData.path,
            file_type: actualFile.type
          }
        });

        if (error) throw error;

        setUploadedFiles(prev => 
          prev.map(f => f.id === file.id ? { ...f, uploaded: true } : f)
        );
        
        toast({
          title: "File processed successfully!",
          description: `${file.name} has been analyzed and processed by AI.`,
        });
      } catch (error: any) {
        console.error('File upload error:', error);
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}. Please try again.`,
          variant: "destructive"
        });
        
        // Remove failed file
        setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-learning">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Upload Study Materials
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
            <p className="text-muted-foreground mb-4">
              Upload PDFs, images, or text files. Our AI will analyze and create summaries, flashcards, and quizzes.
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold">Uploaded Files</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{file.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.uploaded ? (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Processed
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Processing...
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Supported: PDF, DOC, TXT, JPG, PNG (max 10MB each)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {uploadedFiles.some(f => f.uploaded) && (
                <Button variant="hero">
                  Generate Study Materials
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;