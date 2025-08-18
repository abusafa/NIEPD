'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormActions from '@/components/forms/FormActions';

interface FormLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  loading?: boolean;
  isEditing?: boolean;
  showPreview?: boolean;
  className?: string;
}

export default function FormLayout({
  title,
  description,
  children,
  onBack,
  onSave,
  onPreview,
  loading = false,
  isEditing = false,
  showPreview = false,
  className = '',
}: FormLayoutProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Edit Details' : 'Create New'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {children}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Form Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <FormActions
                onBack={onBack}
                onSaveDraft={onSave}
                onPreview={showPreview ? onPreview : undefined}
                loading={loading}
                showPreview={showPreview}
                showWorkflow={false}
                isEditing={isEditing}
              />
            </CardContent>
          </Card>

          {/* Help Text */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <strong>Required fields</strong> are marked with an asterisk (*)
                </div>
                <div>
                  <strong>Bilingual content</strong> - Add both Arabic and English text for better accessibility
                </div>
                <div>
                  <strong>Save frequently</strong> to avoid losing your work
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
