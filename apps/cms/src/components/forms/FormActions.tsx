'use client';

import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  CheckCircle, 
  Clock, 
  Loader2 
} from 'lucide-react';

interface FormActionsProps {
  onBack?: () => void;
  onSaveDraft?: () => void;
  onSubmitReview?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  loading?: boolean;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  showPreview?: boolean;
  showWorkflow?: boolean;
  isEditing?: boolean;
}

export default function FormActions({
  onBack,
  onSaveDraft,
  onSubmitReview,
  onPublish,
  onPreview,
  loading = false,
  status = 'DRAFT',
  showPreview = true,
  showWorkflow = true,
  isEditing = false,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Back Button */}
      <div>
        {onBack && (
          <Button variant="ghost" onClick={onBack} disabled={loading}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Preview Button */}
        {showPreview && onPreview && (
          <Button variant="outline" onClick={onPreview} disabled={loading}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}

        {/* Workflow Actions */}
        {showWorkflow && (
          <>
            {/* Save Draft */}
            {onSaveDraft && (
              <Button 
                variant="outline" 
                onClick={onSaveDraft} 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? 'Save Changes' : 'Save Draft'}
              </Button>
            )}

            {/* Submit for Review */}
            {onSubmitReview && status === 'DRAFT' && (
              <Button 
                variant="outline" 
                onClick={onSubmitReview} 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Clock className="h-4 w-4 mr-2" />
                )}
                Submit for Review
              </Button>
            )}

            {/* Publish Button */}
            {onPublish && (
              <Button 
                onClick={onPublish} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {status === 'PUBLISHED' ? 'Update & Keep Published' : 'Publish Now'}
              </Button>
            )}
          </>
        )}

        {/* Simple Save (when workflow is disabled) */}
        {!showWorkflow && onSaveDraft && (
          <Button onClick={onSaveDraft} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Save Changes' : 'Save'}
          </Button>
        )}
      </div>
    </div>
  );
}
