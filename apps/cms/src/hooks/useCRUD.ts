'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CRUDOptions {
  endpoint: string;
  resourceName?: string;
  onSuccess?: (action: string, data?: unknown) => void;
  onError?: (action: string, error: unknown) => void;
}

interface CRUDState<T> {
  items: T[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

interface CRUDActions<T> {
  fetchItems: (params?: URLSearchParams) => Promise<void>;
  createItem: (data: Partial<T>) => Promise<T | null>;
  updateItem: (id: string, data: Partial<T>) => Promise<T | null>;
  deleteItem: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  reset: () => void;
}

// Legacy return type for backward compatibility
interface LegacyCRUDReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  deleteItem: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

// Overloads for backward compatibility
export function useCRUD<T extends { id: string }>(endpoint: string): LegacyCRUDReturn<T>;
export function useCRUD<T extends { id: string }>(options: CRUDOptions): [CRUDState<T>, CRUDActions<T>];

export function useCRUD<T extends { id: string }>(
  optionsOrEndpoint: CRUDOptions | string
): [CRUDState<T>, CRUDActions<T>] | LegacyCRUDReturn<T> {
  // Determine if we're using the old or new pattern
  const isLegacyCall = typeof optionsOrEndpoint === 'string';
  
  const options: CRUDOptions = isLegacyCall 
    ? { endpoint: optionsOrEndpoint, resourceName: 'item' }
    : optionsOrEndpoint;
    
  const { endpoint, resourceName = 'item', onSuccess, onError } = options;
  
  const [state, setState] = useState<CRUDState<T>>({
    items: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
  });

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const fetchItems = async (params?: URLSearchParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const url = params ? `${endpoint}?${params.toString()}` : endpoint;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both array response and paginated response
        const items = Array.isArray(data) ? data : data.data || data.items || data[Object.keys(data)[0]];
        setState(prev => ({ ...prev, items: items || [], loading: false }));
      } else {
        const error = await response.json();
        setState(prev => ({ ...prev, error: error.error || 'Failed to fetch items', loading: false }));
        onError?.('fetch', error);
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Network error', loading: false }));
      onError?.('fetch', error);
    }
  };

  const createItem = async (data: Partial<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, creating: true, error: null }));
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newItem = await response.json();
        setState(prev => ({ 
          ...prev, 
          items: [newItem, ...prev.items],
          creating: false 
        }));
        toast.success(`${resourceName} created successfully`);
        onSuccess?.('create', newItem);
        return newItem;
      } else {
        const error = await response.json();
        setState(prev => ({ ...prev, error: error.error || 'Failed to create item', creating: false }));
        toast.error(error.error || `Failed to create ${resourceName}`);
        onError?.('create', error);
        return null;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Network error', creating: false }));
      toast.error('Network error');
      onError?.('create', error);
      return null;
    }
  };

  const updateItem = async (id: string, data: Partial<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, updating: true, error: null }));
    
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setState(prev => ({ 
          ...prev, 
          items: prev.items.map(item => item.id === id ? updatedItem : item),
          updating: false 
        }));
        toast.success(`${resourceName} updated successfully`);
        onSuccess?.('update', updatedItem);
        return updatedItem;
      } else {
        const error = await response.json();
        setState(prev => ({ ...prev, error: error.error || 'Failed to update item', updating: false }));
        toast.error(error.error || `Failed to update ${resourceName}`);
        onError?.('update', error);
        return null;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Network error', updating: false }));
      toast.error('Network error');
      onError?.('update', error);
      return null;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    if (!confirm(`Are you sure you want to delete this ${resourceName}?`)) {
      return false;
    }

    setState(prev => ({ ...prev, deleting: true, error: null }));
    
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          items: prev.items.filter(item => item.id !== id),
          deleting: false 
        }));
        toast.success(`${resourceName} deleted successfully`);
        onSuccess?.('delete', { id });
        return true;
      } else {
        const error = await response.json();
        setState(prev => ({ ...prev, error: error.error || 'Failed to delete item', deleting: false }));
        toast.error(error.error || `Failed to delete ${resourceName}`);
        onError?.('delete', error);
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Network error', deleting: false }));
      toast.error('Network error');
      onError?.('delete', error);
      return false;
    }
  };

  const refresh = () => fetchItems();

  const reset = () => {
    setState({
      items: [],
      loading: false,
      creating: false,
      updating: false,
      deleting: false,
      error: null,
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  if (isLegacyCall) {
    // Return legacy format for backward compatibility
    return {
      data: state.items,
      loading: state.loading,
      error: state.error,
      deleteItem,
      refresh,
    };
  }

  // Return new format
  return [
    state,
    {
      fetchItems,
      createItem,
      updateItem,
      deleteItem,
      refresh,
      reset,
    },
  ];
}
