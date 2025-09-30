'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UploadViewProps = {
  onGenerate: (fileName: string, fileContent: string) => void;
  loading: boolean;
};

export function UploadView({ onGenerate, loading }: UploadViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a PDF file.',
        });
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString('base64');
        onGenerate(file.name, base64String);
    } catch (error) {
        console.error("Error processing file:", error)
        toast({
            variant: 'destructive',
            title: 'Error Reading File',
            description: 'There was a problem processing your file.',
        });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
            <UploadCloud className="w-10 h-10" />
          </div>
          <CardTitle>Generate a New Quiz</CardTitle>
          <CardDescription>
            Upload a document (currently PDF only) to automatically generate a multiple-choice
            quiz based on its content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf"
            disabled={loading}
          />
          <Button size="lg" onClick={handleUploadClick} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Upload Document & Generate Quiz'
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            You can upload your own PDF document.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
