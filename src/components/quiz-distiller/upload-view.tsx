'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud } from 'lucide-react';

type UploadViewProps = {
  onGenerate: (fileName: string) => void;
  loading: boolean;
};

export function UploadView({ onGenerate, loading }: UploadViewProps) {
  // Simulating a file upload
  const handleUpload = () => {
    onGenerate('Einsten-Bio.pdf');
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
            Upload a PDF document to automatically generate a multiple-choice
            quiz based on its content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" onClick={handleUpload} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Upload PDF & Generate Quiz'
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            (For demo purposes, this will use a sample document.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
