'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud, Link, FileText, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type UploadViewProps = {
  onGenerate: (inputType: 'file' | 'url' | 'text' | 'youtube', data: string, fileName?: string) => void;
  loading: boolean;
};

function FileUpload({ onGenerate, loading }: { onGenerate: (fileName: string, fileContent: string) => void, loading: boolean }) {
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
      console.error('Error processing file:', error);
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
    <div
      className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
      onClick={handleUploadClick}
    >
      <UploadCloud className="w-12 h-12 text-muted-foreground" />
      <p className="mt-4 text-center text-muted-foreground">
        Click or drag & drop to upload a file.<br />(Only PDF is currently supported)
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
        disabled={loading}
      />
    </div>
  );
}

function UrlUpload({ onGenerate, loading }: { onGenerate: (type: 'youtube' | 'url', url: string) => void, loading: boolean }) {
    const [youtubeUrl, setYoutubeUrl] = React.useState('');
    const [otherUrl, setOtherUrl] = React.useState('');

    const handleGenerate = () => {
        if (youtubeUrl) {
            onGenerate('youtube', youtubeUrl);
        } else if (otherUrl) {
            onGenerate('url', otherUrl);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Youtube className="text-red-500 w-6 h-6" />
                <Input 
                    placeholder="Enter a YouTube URL..." 
                    value={youtubeUrl}
                    onChange={(e) => {
                        setYoutubeUrl(e.target.value);
                        if (e.target.value) setOtherUrl('');
                    }}
                    disabled={loading}
                />
            </div>
            <div className="flex items-center gap-2">
                <Link className="text-muted-foreground w-6 h-6" />
                <Input 
                    placeholder="Enter any other URL..."
                    value={otherUrl}
                    onChange={(e) => {
                        setOtherUrl(e.target.value)
                        if (e.target.value) setYoutubeUrl('');
                    }}
                    disabled={loading}
                />
            </div>
            <Button onClick={handleGenerate} disabled={loading || (!youtubeUrl && !otherUrl)}>
                {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                Generate from URL
            </Button>
        </div>
    )
}

function TextUpload({ onGenerate, loading }: { onGenerate: (text: string) => void, loading: boolean }) {
    const [text, setText] = React.useState('');

    const handleGenerate = () => {
        if (text.trim()) {
            onGenerate(text);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Textarea 
                placeholder="Paste your text here..." 
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
            />
            <Button onClick={handleGenerate} disabled={loading || !text.trim()}>
                {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                Generate from Text
            </Button>
        </div>
    )
}


export function UploadView({ onGenerate, loading }: UploadViewProps) {

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-2xl text-center shadow-lg glassmorphism-card">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
            <UploadCloud className="w-10 h-10" />
          </div>
          <CardTitle>Generate a New Quiz</CardTitle>
          <CardDescription>
            Generate a multiple-choice quiz from a document, website, or text.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p className="mt-4 text-muted-foreground">Generating your quiz...</p>
            </div>
          ) : (
            <Tabs defaultValue="file">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="file"><UploadCloud className="mr-2"/>From File</TabsTrigger>
                <TabsTrigger value="url"><Link className="mr-2"/>From URL</TabsTrigger>
                <TabsTrigger value="text"><FileText className="mr-2"/>From Text</TabsTrigger>
              </TabsList>
              <TabsContent value="file">
                <FileUpload 
                  onGenerate={(fileName, fileContent) => onGenerate('file', fileContent, fileName)} 
                  loading={loading} 
                />
              </TabsContent>
              <TabsContent value="url">
                <UrlUpload 
                  onGenerate={(type, url) => onGenerate(type, url)}
                  loading={loading}
                />
              </TabsContent>
              <TabsContent value="text">
                <TextUpload
                    onGenerate={(text) => onGenerate('text', text, 'Custom Text Quiz')}
                    loading={loading}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
