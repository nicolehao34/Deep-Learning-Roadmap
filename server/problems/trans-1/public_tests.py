"""
Public test cases for Q15: Scaled Dot-Product Attention

These tests verify basic functionality and edge cases.
Students can use these to validate their implementation.
"""

import torch
import torch.nn as nn
import pytest
from solution import ScaledDotProductAttention, scaled_dot_product_attention


class TestBasicFunctionality:
    """Test basic attention computation without masks."""

    def test_basic_attention_shape(self):
        """Test output shapes are correct."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        output, attn_weights = attention(Q, K, V)

        assert output.shape == (batch, num_heads, seq_len, d_k)
        assert attn_weights.shape == (batch, num_heads, seq_len, seq_len)

    def test_attention_weights_sum_to_one(self):
        """Test that attention weights sum to 1 along key dimension."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        _, attn_weights = attention(Q, K, V)

        weight_sums = attn_weights.sum(dim=-1)
        expected = torch.ones_like(weight_sums)

        assert torch.allclose(weight_sums, expected, atol=1e-6)

    def test_different_seq_lengths(self):
        """Test with different query and key sequence lengths."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads = 2, 4
        seq_len_q, seq_len_k, d_k = 10, 15, 64

        Q = torch.randn(batch, num_heads, seq_len_q, d_k)
        K = torch.randn(batch, num_heads, seq_len_k, d_k)
        V = torch.randn(batch, num_heads, seq_len_k, d_k)

        output, attn_weights = attention(Q, K, V)

        assert output.shape == (batch, num_heads, seq_len_q, d_k)
        assert attn_weights.shape == (batch, num_heads, seq_len_q, seq_len_k)

    def test_different_value_dimension(self):
        """Test with different value dimension."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len = 2, 4, 8
        d_k, d_v = 64, 128

        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_v)

        output, attn_weights = attention(Q, K, V)

        assert output.shape == (batch, num_heads, seq_len, d_v)
        assert attn_weights.shape == (batch, num_heads, seq_len, seq_len)


class TestCausalMasking:
    """Test causal (lower triangular) masking."""

    def test_causal_mask_structure(self):
        """Test that causal mask creates lower triangular attention weights."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len, d_k = 1, 1, 5, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        _, attn_weights = attention(Q, K, V, is_causal=True)

        attn_matrix = attn_weights[0, 0]

        for i in range(seq_len):
            for j in range(i + 1, seq_len):
                assert torch.isclose(attn_matrix[i, j], torch.tensor(0.0), atol=1e-6), \
                    f"Causal mask failed: position ({i}, {j}) should be 0, got {attn_matrix[i, j]}"

    def test_causal_mask_diagonal(self):
        """Test that diagonal elements can attend to themselves."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len, d_k = 1, 1, 5, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        _, attn_weights = attention(Q, K, V, is_causal=True)

        attn_matrix = attn_weights[0, 0]

        for i in range(seq_len):
            assert attn_matrix[i, i] > 0, f"Diagonal element at ({i}, {i}) should be positive"


class TestAttentionMask:
    """Test custom attention masking."""

    def test_padding_mask(self):
        """Test masking out specific positions (e.g., padding)."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len, d_k = 1, 1, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        attn_mask = torch.zeros(seq_len, seq_len)
        attn_mask[:, -2:] = float('-inf')

        _, attn_weights = attention(Q, K, V, attn_mask=attn_mask)

        attn_matrix = attn_weights[0, 0]

        assert torch.allclose(attn_matrix[:, -2:], torch.zeros(seq_len, 2), atol=1e-6)

    def test_combined_causal_and_padding_mask(self):
        """Test combining causal mask with padding mask."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len, d_k = 1, 1, 6, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        attn_mask = torch.zeros(seq_len, seq_len)
        attn_mask[:, -1] = float('-inf')

        _, attn_weights = attention(Q, K, V, attn_mask=attn_mask, is_causal=True)

        attn_matrix = attn_weights[0, 0]

        for i in range(seq_len):
            for j in range(i + 1, seq_len):
                assert torch.isclose(attn_matrix[i, j], torch.tensor(0.0), atol=1e-6)

        assert torch.allclose(attn_matrix[:, -1], torch.zeros(seq_len), atol=1e-6)


class TestDropout:
    """Test dropout functionality."""

    def test_dropout_training_mode(self):
        """Test that dropout is applied in training mode."""
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.5)
        attention.train()

        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        output1, _ = attention(Q, K, V)
        output2, _ = attention(Q, K, V)

        assert not torch.allclose(output1, output2, atol=1e-6)

    def test_dropout_eval_mode(self):
        """Test that dropout is NOT applied in eval mode."""
        attention = ScaledDotProductAttention(dropout=0.5)
        attention.eval()

        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        output1, _ = attention(Q, K, V)
        output2, _ = attention(Q, K, V)

        assert torch.allclose(output1, output2, atol=1e-6)


class TestEdgeCases:
    """Test edge cases and error handling."""

    def test_single_element_sequence(self):
        """Test with sequence length of 1."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len, d_k = 1, 1, 1, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        output, attn_weights = attention(Q, K, V)

        assert output.shape == (batch, num_heads, seq_len, d_k)
        assert torch.allclose(attn_weights, torch.ones(batch, num_heads, seq_len, seq_len))

    def test_invalid_dropout_value(self):
        """Test that invalid dropout values raise errors."""
        with pytest.raises(ValueError):
            ScaledDotProductAttention(dropout=-0.1)

        with pytest.raises(ValueError):
            ScaledDotProductAttention(dropout=1.0)

    def test_dimension_mismatch(self):
        """Test that dimension mismatches raise errors."""
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()

        batch, num_heads, seq_len = 2, 4, 8
        Q = torch.randn(batch, num_heads, seq_len, 64)
        K = torch.randn(batch, num_heads, seq_len, 32)  # Wrong dimension
        V = torch.randn(batch, num_heads, seq_len, 64)

        with pytest.raises(ValueError):
            attention(Q, K, V)


class TestFunctionalInterface:
    """Test the functional interface."""

    def test_functional_interface_basic(self):
        """Test functional interface produces correct output."""
        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        output, attn_weights = scaled_dot_product_attention(
            Q, K, V, dropout_p=0.0, training=False
        )

        assert output.shape == (batch, num_heads, seq_len, d_k)
        assert attn_weights.shape == (batch, num_heads, seq_len, seq_len)

    def test_functional_interface_with_causal(self):
        """Test functional interface with causal masking."""
        batch, num_heads, seq_len, d_k = 1, 1, 5, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)

        _, attn_weights = scaled_dot_product_attention(
            Q, K, V, is_causal=True, dropout_p=0.0, training=False
        )

        attn_matrix = attn_weights[0, 0]

        for i in range(seq_len):
            for j in range(i + 1, seq_len):
                assert torch.isclose(attn_matrix[i, j], torch.tensor(0.0), atol=1e-6)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
