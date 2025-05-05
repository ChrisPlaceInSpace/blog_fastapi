import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
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

const deleteArticle = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:8000/articles/${id}`);
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['article', id],
    queryFn: () => fetchArticle(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate('/');
    },
  });

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
        <Typography variant="h4" gutterBottom>
          {article.title}
        </Typography>
        {article.publish_date && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Published: {new Date(article.publish_date).toLocaleDateString()}
          </Typography>
        )}
        <Box sx={{ my: 2 }}>
          {article.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <Typography variant="body1" paragraph>
          {article.content}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/edit/${article._id}`)}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this article?')) {
                deleteMutation.mutate(article._id);
              }
            }}
          >
            Delete
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ArticleDetail; 