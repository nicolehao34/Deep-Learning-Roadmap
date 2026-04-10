"""
Private evaluation script for Q15: Scaled Dot-Product Attention

Grading Criteria:
- Numerical accuracy (atol=1e-5): 40 points
- Correct masking behavior: 30 points
- Dropout implementation: 15 points
- Edge case handling: 15 points

Total: 100 points
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import pytest
from solution import ScaledDotProductAttention, scaled_dot_product_attention


def pytorch_reference_attention(
    query, key, value, attn_mask=None, dropout_p=0.0, is_causal=False, training=True
):
    batch_size, num_heads, seq_len_q, d_k = query.shape
    seq_len_k = key.shape[2]

    attn_scores = torch.matmul(query, key.transpose(-2, -1)) / (d_k ** 0.5)

    if is_causal:
        causal_mask = torch.triu(
            torch.ones(seq_len_q, seq_len_k, dtype=torch.bool, device=query.device), diagonal=1
        )
        causal_mask_value = torch.zeros(seq_len_q, seq_len_k, dtype=query.dtype, device=query.device)
        causal_mask_value.masked_fill_(causal_mask, float('-inf'))
        attn_mask = attn_mask + causal_mask_value if attn_mask is not None else causal_mask_value

    if attn_mask is not None:
        attn_scores = attn_scores + attn_mask

    attn_weights = F.softmax(attn_scores, dim=-1)
    attn_weights = torch.nan_to_num(attn_weights, nan=0.0)

    if training and dropout_p > 0.0:
        attn_weights = F.dropout(attn_weights, p=dropout_p, training=True)

    return torch.matmul(attn_weights, value), attn_weights


class TestNumericalAccuracy:
    """Test numerical accuracy against PyTorch reference (40 points)."""

    def test_basic_accuracy_small(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        output_student, weights_student = attention(Q, K, V)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5), \
            f"Output mismatch: max diff = {(output_student - output_ref).abs().max()}"
        assert torch.allclose(weights_student, weights_ref, atol=1e-5), \
            f"Weights mismatch: max diff = {(weights_student - weights_ref).abs().max()}"

    def test_basic_accuracy_large(self):
        torch.manual_seed(123)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 8, 12, 128, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        output_student, weights_student = attention(Q, K, V)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, weights_ref, atol=1e-5)

    def test_accuracy_different_dimensions(self):
        torch.manual_seed(456)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads = 4, 8
        seq_len_q, seq_len_k = 32, 48
        d_k, d_v = 64, 128
        Q = torch.randn(batch, num_heads, seq_len_q, d_k)
        K = torch.randn(batch, num_heads, seq_len_k, d_k)
        V = torch.randn(batch, num_heads, seq_len_k, d_v)
        output_student, weights_student = attention(Q, K, V)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, weights_ref, atol=1e-5)

    def test_accuracy_extreme_values(self):
        torch.manual_seed(789)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 2, 4, 16, 64
        for scale in [10.0, 0.01]:
            Q = torch.randn(batch, num_heads, seq_len, d_k) * scale
            K = torch.randn(batch, num_heads, seq_len, d_k) * scale
            V = torch.randn(batch, num_heads, seq_len, d_k) * scale
            output_student, weights_student = attention(Q, K, V)
            output_ref, weights_ref = pytorch_reference_attention(Q, K, V, training=False)
            assert torch.allclose(output_student, output_ref, atol=1e-5)
            assert torch.allclose(weights_student, weights_ref, atol=1e-5)


class TestMaskingAccuracy:
    """Test masking behavior accuracy (30 points)."""

    def test_causal_mask_accuracy(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 4, 8, 32, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        output_student, weights_student = attention(Q, K, V, is_causal=True)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, is_causal=True, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, weights_ref, atol=1e-5)

    def test_padding_mask_accuracy(self):
        torch.manual_seed(123)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len_q, seq_len_k, d_k = 4, 8, 20, 25, 64
        Q = torch.randn(batch, num_heads, seq_len_q, d_k)
        K = torch.randn(batch, num_heads, seq_len_k, d_k)
        V = torch.randn(batch, num_heads, seq_len_k, d_k)
        attn_mask = torch.zeros(seq_len_q, seq_len_k)
        attn_mask[0, 20:] = float('-inf')
        attn_mask[1, 22:] = float('-inf')
        attn_mask[2:5, 18:] = float('-inf')
        output_student, weights_student = attention(Q, K, V, attn_mask=attn_mask)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, attn_mask=attn_mask, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, weights_ref, atol=1e-5)

    def test_combined_masks_accuracy(self):
        torch.manual_seed(456)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 4, 8, 24, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        attn_mask = torch.zeros(seq_len, seq_len)
        attn_mask[:, -5:] = float('-inf')
        output_student, weights_student = attention(Q, K, V, attn_mask=attn_mask, is_causal=True)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, attn_mask=attn_mask, is_causal=True, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, weights_ref, atol=1e-5)


class TestDropoutImplementation:
    """Test dropout implementation (15 points)."""

    def test_dropout_reproducibility(self):
        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        torch.manual_seed(42)
        attention1 = ScaledDotProductAttention(dropout=0.3)
        attention1.train()
        output1, _ = attention1(Q, K, V)
        torch.manual_seed(42)
        attention2 = ScaledDotProductAttention(dropout=0.3)
        attention2.train()
        output2, _ = attention2(Q, K, V)
        assert torch.allclose(output1, output2, atol=1e-6)

    def test_dropout_affects_output(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.5)
        attention.train()
        batch, num_heads, seq_len, d_k = 4, 8, 16, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        outputs = [attention(Q, K, V)[0] for _ in range(5)]
        for i in range(len(outputs)):
            for j in range(i + 1, len(outputs)):
                assert not torch.allclose(outputs[i], outputs[j], atol=1e-5)

    def test_dropout_zero_in_eval(self):
        attention = ScaledDotProductAttention(dropout=0.5)
        attention.eval()
        batch, num_heads, seq_len, d_k = 2, 4, 8, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        outputs = [attention(Q, K, V)[0] for _ in range(3)]
        for i in range(len(outputs) - 1):
            assert torch.allclose(outputs[i], outputs[i + 1], atol=1e-6)


class TestEdgeCases:
    """Test edge cases and robustness (15 points)."""

    def test_single_token_sequence(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 2, 4, 1, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        output_student, weights_student = attention(Q, K, V)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, torch.ones_like(weights_student))

    def test_very_long_sequence(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 1, 2, 512, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        output_student, _ = attention(Q, K, V)
        output_ref, _ = pytorch_reference_attention(Q, K, V, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)

    def test_fully_masked_row(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 1, 1, 5, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        attn_mask = torch.zeros(seq_len, seq_len)
        attn_mask[1, :] = float('-inf')
        output_student, weights_student = attention(Q, K, V, attn_mask=attn_mask)
        assert torch.allclose(weights_student[0, 0, 1, :], torch.zeros(seq_len), atol=1e-6)
        assert torch.allclose(output_student[0, 0, 1, :], torch.zeros(d_k), atol=1e-6)

    def test_minimal_dimensions(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 1, 1, 2, 16
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        output_student, weights_student = attention(Q, K, V)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, weights_ref, atol=1e-5)

    def test_broadcasting_mask(self):
        torch.manual_seed(42)
        attention = ScaledDotProductAttention(dropout=0.0)
        attention.eval()
        batch, num_heads, seq_len, d_k = 4, 8, 10, 64
        Q = torch.randn(batch, num_heads, seq_len, d_k)
        K = torch.randn(batch, num_heads, seq_len, d_k)
        V = torch.randn(batch, num_heads, seq_len, d_k)
        attn_mask = torch.zeros(seq_len, seq_len)
        attn_mask[:, -3:] = float('-inf')
        output_student, weights_student = attention(Q, K, V, attn_mask=attn_mask)
        output_ref, weights_ref = pytorch_reference_attention(Q, K, V, attn_mask=attn_mask, training=False)
        assert torch.allclose(output_student, output_ref, atol=1e-5)
        assert torch.allclose(weights_student, weights_ref, atol=1e-5)


# ─── Point values per test ────────────────────────────────────────────────────

POINTS = {
    "TestNumericalAccuracy::test_basic_accuracy_small": 10,
    "TestNumericalAccuracy::test_basic_accuracy_large": 10,
    "TestNumericalAccuracy::test_accuracy_different_dimensions": 10,
    "TestNumericalAccuracy::test_accuracy_extreme_values": 10,
    "TestMaskingAccuracy::test_causal_mask_accuracy": 10,
    "TestMaskingAccuracy::test_padding_mask_accuracy": 10,
    "TestMaskingAccuracy::test_combined_masks_accuracy": 10,
    "TestDropoutImplementation::test_dropout_reproducibility": 5,
    "TestDropoutImplementation::test_dropout_affects_output": 5,
    "TestDropoutImplementation::test_dropout_zero_in_eval": 5,
    "TestEdgeCases::test_single_token_sequence": 3,
    "TestEdgeCases::test_very_long_sequence": 3,
    "TestEdgeCases::test_fully_masked_row": 3,
    "TestEdgeCases::test_minimal_dimensions": 3,
    "TestEdgeCases::test_broadcasting_mask": 3,
}

CATEGORY_TOTALS = {
    "Numerical Accuracy": 40,
    "Masking": 30,
    "Dropout": 15,
    "Edge Cases": 15,
}

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
