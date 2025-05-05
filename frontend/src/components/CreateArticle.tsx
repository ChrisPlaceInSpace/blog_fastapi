import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
} from '@mui/material';
import axios from 'axios';

interface ArticleInput {
  title: string;
  content: string;
  tags: string[];
  publish_date?: string;
}

const createArticle = async (article: ArticleInput): Promise<{ id: string }> => {
  const response = await axios.post('http://localhost:8000/articles', article);
  return response.data;
};

const CreateArticle = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate('/');
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      tags,
      publish_date: new Date().toISOString(),
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Article
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            variant="outlined"
            required
            multiline
            rows={6}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Add Tags"
              value={tagInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
              inputProps={{
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }
              }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={handleAddTag}
              sx={{ mt: 1 }}
            >
              Add Tag
            </Button>
          </Box>
          <Box sx={{ mt: 2, mb: 3 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createMutation.isPending}
            >
              Create Article
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateArticle; 