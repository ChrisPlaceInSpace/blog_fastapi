import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface Article {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  publish_date?: string;
}

const fetchArticle = async (id: string): Promise<Article> => {
  const response = await axios.get(`http://localhost:8000/articles/${id}`);
  return response.data;
};

const updateArticle = async ({ id, article }: { id: string; article: Omit<Article, '_id'> }): Promise<void> => {
  await axios.put(`http://localhost:8000/articles/${id}`, article);
};

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['article', id],
    queryFn: () => fetchArticle(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      navigate(`/articles/${id}`);
    },
  });

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setTags(article.tags);
    }
  }, [article]);

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
    if (!title.trim() || !content.trim() || !id) return;

    updateMutation.mutate({
      id,
      article: {
        title: title.trim(),
        content: content.trim(),
        tags,
        publish_date: article?.publish_date,
      },
    });
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Error loading article</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Article
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
              disabled={updateMutation.isPending}
            >
              Update Article
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/articles/${id}`)}
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

export default EditArticle; 