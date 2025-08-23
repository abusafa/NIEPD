'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FAQStatusBadge from './FAQStatusBadge';
import { Eye, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface FAQ {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  sortOrder: number;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FAQCardProps {
  faq: FAQ;
  onView?: (faq: FAQ) => void;
  onEdit?: (faq: FAQ) => void;
  onDelete?: (faq: FAQ) => void;
  onMoveUp?: (faq: FAQ) => void;
  onMoveDown?: (faq: FAQ) => void;
  showActions?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function FAQCard({
  faq,
  onView,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  showActions = true,
  expanded = false,
  onToggleExpand,
}: FAQCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Questions */}
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {faq.questionEn}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1" dir="rtl">
                {faq.questionAr}
              </p>
            </div>
            
            {/* Metadata */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Order: {faq.sortOrder}</span>
              <span>•</span>
              <span>Updated: {new Date(faq.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <FAQStatusBadge status={faq.status} size="sm" />
            {onToggleExpand && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="h-8 w-8 p-0"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 pt-3 border-t">
            {/* Answer Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Answer Preview:</h4>
              <div className="text-sm text-gray-600 line-clamp-3">
                {faq.answerEn}
              </div>
              <div className="text-sm text-gray-600 line-clamp-2" dir="rtl">
                {faq.answerAr}
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      {showActions && (
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              {onMoveUp && (
                <Button variant="outline" size="sm" onClick={() => onMoveUp(faq)}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              )}
              {onMoveDown && (
                <Button variant="outline" size="sm" onClick={() => onMoveDown(faq)}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {onView && (
                <Button variant="outline" size="sm" onClick={() => onView(faq)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(faq)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDelete(faq)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
