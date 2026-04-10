
// place holder, will be replaced with real problems in the future. 
// The unlocksNodeIds field should contain the IDs of the nodes that will be unlocked when the problem is solved.

export interface Problem {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  categoryKey: string
  tags: string[]
  unlocksNodeIds: string[]
}

export const problems: Problem[] = [
  // ─── Neural Networks ──────────────────────────────────────────────────────
  {
    id: 'nn-1',
    title: 'Implement Backpropagation from Scratch',
    description:
      'Build a fully connected neural network in NumPy with at least 2 hidden layers. Implement forward pass, cross-entropy loss, and backpropagation manually — no autograd allowed. Train it to classify the spiral dataset and report training loss per epoch.',
    difficulty: 'Hard',
    categoryKey: 'neural-networks',
    tags: ['numpy', 'backprop', 'gradients', 'mlp'],
    unlocksNodeIds: ['yq1GFhXlfYAQ', 'G_Ymzn83_uSA', 'zjDnVgHMaxQH'],
  },
  {
    id: 'nn-2',
    title: 'Build a CNN for Image Classification from Scratch',
    description:
      'Implement a 2D convolution layer (forward + backward pass) using only NumPy, including stride and zero-padding. Stack it with a pooling layer and a fully connected head to classify CIFAR-10. Compare parameter counts with an equivalent MLP.',
    difficulty: 'Hard',
    categoryKey: 'neural-networks',
    tags: ['cnn', 'convolution', 'numpy', 'image-classification'],
    unlocksNodeIds: ['Xq1GfzB5.WGg', '_G8mKvDKVkTy', 'BlEncB4j2Rw7', 'nT8m6-AViuhz', 'sP8mWnhryEbM'],
  },
  {
    id: 'nn-3',
    title: 'Implement Batch Normalization Forward & Backward',
    description:
      'Implement batch normalization from scratch including the full backward pass through the normalisation, scale, and shift parameters. Show that it stabilises training by comparing loss curves with and without it on a deep network.',
    difficulty: 'Medium',
    categoryKey: 'neural-networks',
    tags: ['batch-norm', 'normalisation', 'training-stability'],
    unlocksNodeIds: ['RcEnEW52Bixp', 'lr8m0pCiOYVT', 'zt8mUUJMUa3Q', 'rE9mzL7_A.IC'],
  },
  {
    id: 'nn-4',
    title: 'Implement an RNN and Solve Character-Level Language Modelling',
    description:
      'Build a vanilla RNN from scratch in NumPy. Implement forward pass, cross-entropy loss over sequences, and backpropagation through time (BPTT). Train it to predict the next character in a small text corpus and sample new text from it.',
    difficulty: 'Hard',
    categoryKey: 'neural-networks',
    tags: ['rnn', 'bptt', 'language-model', 'sequences'],
    unlocksNodeIds: ['Qr1GhPWOA-.Q', 'Ek~m~tgKEwiH', 'Qu~mclIEc4d8', 'tT.m2aWSFPcv'],
  },
  {
    id: 'nn-5',
    title: 'Build an LSTM Cell from Scratch',
    description:
      'Implement an LSTM cell from scratch with input, forget, and output gates plus the cell state update. Compare it against the vanilla RNN on a sequence with long-range dependencies. Explain in comments why the cell state mitigates the vanishing gradient.',
    difficulty: 'Hard',
    categoryKey: 'neural-networks',
    tags: ['lstm', 'gates', 'vanishing-gradient', 'sequences'],
    unlocksNodeIds: ['zV.mvPFb4E_O', 'IW.m~AD~ARY-', 'ZW.mHXAHwrNV', 'll~m7v~7KBMU', 'mW.mV4otupen'],
  },

  // ─── Perceptron ───────────────────────────────────────────────────────────
  {
    id: 'perc-1',
    title: 'Implement the Perceptron Learning Algorithm',
    description:
      'Write a single perceptron from scratch. Use the perceptron update rule to classify linearly separable 2D data. Plot the decision boundary after each update step and record the number of steps to convergence.',
    difficulty: 'Easy',
    categoryKey: 'perceptron',
    tags: ['perceptron', 'linear-classifier', 'decision-boundary'],
    unlocksNodeIds: ['C6Ym-lLJ0fzz', 'k6CnIM8fO3B1', 'h9CnbQBtv9.d', 'F9CnmjPxgtnH', 'T-CnnU9dL76g'],
  },
  {
    id: 'perc-2',
    title: 'Prove XOR Requires a Multi-Layer Network',
    description:
      'First show empirically that a single perceptron cannot converge on XOR — plot the failed decision boundary. Then build a 2-layer MLP with a hidden layer of 2 neurons that solves XOR exactly. Visualise the two decision boundaries learned by the hidden layer.',
    difficulty: 'Easy',
    categoryKey: 'perceptron',
    tags: ['xor', 'mlp', 'non-linear', 'decision-boundary'],
    unlocksNodeIds: ['o-YmDk9YpuUP', '.WDn6_vJi67r', '5-Ym3U15k9Qi', 'gzDnZTkeCRqz'],
  },
  {
    id: 'perc-3',
    title: 'Implement an MLP with Backpropagation for MNIST',
    description:
      'Build a 3-layer MLP (784 → 256 → 128 → 10) in NumPy. Implement ReLU activations, softmax output, cross-entropy loss, and full backpropagation. Achieve > 96% test accuracy on MNIST and log training/validation loss curves.',
    difficulty: 'Medium',
    categoryKey: 'perceptron',
    tags: ['mlp', 'backprop', 'mnist', 'relu', 'softmax'],
    unlocksNodeIds: ['G_Ymzn83_uSA', 'zjDnVgHMaxQH', '35CnDh75grug'],
  },
  {
    id: 'perc-4',
    title: 'Implement Statistical Learning Theory Concepts',
    description:
      'Implement empirical risk minimisation from scratch on a toy dataset. Compute the training loss, validation loss, and VC-dimension-inspired generalisation bound. Demonstrate overfitting by varying model capacity.',
    difficulty: 'Medium',
    categoryKey: 'perceptron',
    tags: ['erm', 'generalisation', 'overfitting', 'capacity'],
    unlocksNodeIds: ['rWCnQtvs6qhX', 'V7YmAe59fQ2u', 'zjgnJ~ZiSGQB'],
  },
  {
    id: 'perc-5',
    title: 'Build a Perceptron for Non-linearly Separable Data with Kernel Trick',
    description:
      'Implement a kernel perceptron using the polynomial and RBF kernels. Show that it successfully classifies a circular (non-linearly separable) dataset where a linear perceptron fails. Compare decision boundaries across kernels.',
    difficulty: 'Medium',
    categoryKey: 'perceptron',
    tags: ['kernel', 'kernel-perceptron', 'rbf', 'non-linear'],
    unlocksNodeIds: ['CXDn6x_EDaVx', 'dYDnWtcE5ZyC'],
  },

  // ─── Optimization Algorithms ──────────────────────────────────────────────
  {
    id: 'opt-1',
    title: 'Implement SGD, Momentum, and AdaGrad from Scratch',
    description:
      'Write three optimisers from scratch in NumPy: vanilla SGD, SGD with momentum, and AdaGrad. Plot their loss trajectories on a 2D Rosenbrock function and explain in comments why momentum escapes the narrow valley.',
    difficulty: 'Medium',
    categoryKey: 'optimization',
    tags: ['sgd', 'momentum', 'adagrad', 'optimiser'],
    unlocksNodeIds: ['l~Ymz8FByu5m', '6~YmPkqky.70', 'caZmu3d3kpDu', 'kaZmIe~NN-_l', 'yiZmhj4NWGez'],
  },
  {
    id: 'opt-2',
    title: 'Implement Adam and AdamW from Scratch',
    description:
      'Implement the full Adam optimiser (bias-corrected first and second moment estimates) and AdamW (decoupled weight decay). Train a small MLP on MNIST with both and show that AdamW generalises better at the same learning rate.',
    difficulty: 'Medium',
    categoryKey: 'optimization',
    tags: ['adam', 'adamw', 'weight-decay', 'moments'],
    unlocksNodeIds: ['LaZmI--VUCjE', 'vo8mF9JfowCG', '0MEn0_ZC9ngd', 'gMEnphVIJM71'],
  },
  {
    id: 'opt-3',
    title: 'Implement RMSProp and Compare Adaptive Optimisers',
    description:
      'Implement RMSProp from scratch. Compare SGD, Momentum, AdaGrad, RMSProp, and Adam on a non-convex function. Write an analysis explaining why AdaGrad\'s learning rate decays to zero and how RMSProp fixes this.',
    difficulty: 'Medium',
    categoryKey: 'optimization',
    tags: ['rmsprop', 'adaptive-lr', 'comparison'],
    unlocksNodeIds: ['uaZmMUpp.qbc', 'GNEnF-lKGgTI', '2JEnQqyt61em', '8JEn4uDfmEGt'],
  },
  {
    id: 'opt-4',
    title: 'Implement Learning Rate Scheduling',
    description:
      'Implement step decay, cosine annealing, and warm restarts (SGDR) schedulers from scratch. Train a ResNet-style model on CIFAR-10 with each scheduler and plot the learning rate trajectory alongside the validation accuracy curve.',
    difficulty: 'Easy',
    categoryKey: 'optimization',
    tags: ['lr-schedule', 'cosine-annealing', 'warm-restart'],
    unlocksNodeIds: ['z0EnXaoh99vL', '1mZmwmK7FRH-', 'qa8mBjVM5YQG'],
  },
  {
    id: 'opt-5',
    title: 'Visualise Gradient Descent on a Loss Surface',
    description:
      'Implement and animate gradient descent, mini-batch SGD, and Adam on a 3D loss surface (e.g., Beale\'s function). Visualise the trajectory of each optimiser on a contour plot, highlighting convergence speed and stability differences.',
    difficulty: 'Easy',
    categoryKey: 'optimization',
    tags: ['gradient-descent', 'visualisation', 'loss-surface'],
    unlocksNodeIds: ['6gZmduZ4qLun', 'dGEnK37aV0gL', 'PEEn4ep4_hFJ', 'qYEnyYK42zXp'],
  },

  // ─── Regularization Techniques ────────────────────────────────────────────
  {
    id: 'reg-1',
    title: 'Implement L1 and L2 Regularisation from Scratch',
    description:
      'Add L1 and L2 penalty terms to a linear regression implemented from scratch. Demonstrate the effect on weights: L1 produces sparse weights while L2 distributes weight mass. Plot the coefficient paths as the regularisation strength λ increases.',
    difficulty: 'Easy',
    categoryKey: 'regularization',
    tags: ['l1', 'l2', 'sparsity', 'weight-decay'],
    unlocksNodeIds: ['n5YmXLaYY8WP', '_aZmFgX2MXfp', 'ZaZm8Y-hJr5A', 'A7Dn_kfy-C5D', 'XSGnYkXSWBSB'],
  },
  {
    id: 'reg-2',
    title: 'Implement Dropout from Scratch',
    description:
      'Implement dropout with an inverted scaling (divide by keep-probability during training). Train an over-parameterised MLP on a small dataset with and without dropout, plot generalisation curves, and explain why it approximates ensembling.',
    difficulty: 'Easy',
    categoryKey: 'regularization',
    tags: ['dropout', 'regularisation', 'ensemble'],
    unlocksNodeIds: ['cbZmF-G6T.7O', 'sq8m0DJh_ihI'],
  },
  {
    id: 'reg-3',
    title: 'Implement Gradient Clipping',
    description:
      'Implement both value clipping and norm clipping from scratch. Train a deep RNN on a long-sequence task and demonstrate the exploding gradient problem. Show that norm clipping keeps the gradient direction intact while preventing explosion.',
    difficulty: 'Medium',
    categoryKey: 'regularization',
    tags: ['gradient-clipping', 'exploding-gradients', 'rnn'],
    unlocksNodeIds: ['cC8mD-mO99Da', 'AC8mRgb5U5_5'],
  },
  {
    id: 'reg-4',
    title: 'Implement Data Augmentation Pipeline',
    description:
      'Build a data augmentation pipeline from scratch for image classification: random horizontal flip, random crop, colour jitter, and mixup. Measure the improvement in test accuracy on CIFAR-10 when augmentation is applied vs. not.',
    difficulty: 'Easy',
    categoryKey: 'regularization',
    tags: ['data-augmentation', 'mixup', 'image', 'cifar'],
    unlocksNodeIds: ['bD8mHInvv0Ae'],
  },
  {
    id: 'reg-5',
    title: 'Implement Early Stopping with Validation Monitoring',
    description:
      'Implement early stopping with a patience parameter from scratch. Train a neural network until the validation loss has not improved for N epochs, then restore the best checkpoint. Compare final test accuracy with a model trained to completion.',
    difficulty: 'Easy',
    categoryKey: 'regularization',
    tags: ['early-stopping', 'validation', 'overfitting'],
    unlocksNodeIds: ['yPGnHmvaqlpS', 'wZ9mhQ4.H6c7', 'nY9m6PCfk3C3'],
  },

  // ─── Transformers & Attention ─────────────────────────────────────────────
  {
    id: 'trans-1',
    title: 'Implement Scaled Dot-Product Attention from Scratch',
    description:
      'Implement scaled dot-product attention in NumPy: compute Q·Kᵀ/√d_k, apply softmax, then multiply by V. Add an optional causal mask for autoregressive use. Verify correctness by checking that the output is a weighted sum of the values.',
    difficulty: 'Medium',
    categoryKey: 'transformers',
    tags: ['attention', 'dot-product', 'softmax', 'transformer'],
    unlocksNodeIds: ['yq1GqjMt5lBT', 'GmEndfG64YOX', 'PtInHHGPYS6P'],
  },
  {
    id: 'trans-2',
    title: 'Build Multi-Head Attention from Scratch',
    description:
      'Extend your dot-product attention to multi-head attention: project Q, K, V into h heads, run attention in parallel, concatenate, and project back. Show that different heads attend to different parts of a sequence on a toy task.',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['multi-head-attention', 'transformer', 'projection'],
    unlocksNodeIds: ['4Y.mDKFls_HP', 'W7HnvPoDsCsi', 'V2.mFc53Jx2Z', 'B1.mQsRz0UDx'],
  },
  {
    id: 'trans-3',
    title: 'Implement a Full Transformer Encoder from Scratch',
    description:
      'Build a complete Transformer encoder block: multi-head self-attention → add & norm → feed-forward → add & norm. Include sinusoidal positional encoding. Stack 6 blocks and train on a sequence classification task.',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['transformer-encoder', 'positional-encoding', 'layer-norm'],
    unlocksNodeIds: ['j9.mMpMKdJY8', '8uInCWaVmC~E', 'VVfn9NhMBO9e'],
  },
  {
    id: 'trans-4',
    title: 'Implement a GPT-Style Autoregressive Transformer',
    description:
      'Build a decoder-only transformer (GPT-style) from scratch with causal self-attention. Train it on character-level language modelling. Generate text by sampling autoregressively and implement temperature-based sampling.',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['gpt', 'decoder', 'causal-attention', 'autoregressive', 'language-model'],
    unlocksNodeIds: ['F9.mfP7V5HWB', 'REInEyzfgUlk', 'DVfnF_o-Y9fm'],
  },
  {
    id: 'trans-5',
    title: 'Implement Cross-Attention for Encoder-Decoder Models',
    description:
      'Build an encoder-decoder transformer where the decoder cross-attends to the encoder output using Q from the decoder and K, V from the encoder. Train on a simple sequence-to-sequence task (e.g., number sorting or copy task).',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['cross-attention', 'encoder-decoder', 'seq2seq'],
    unlocksNodeIds: ['BFInMmyl7G21', 'oFInQklGdUx-', 'Z4.m5HY7AjWk', 'Y5.m3r~K4qf3'],
  },
  {
    id: 'trans-6',
    title: 'Causal Mask Construction',
    description:
      'Implement a causal (lower-triangular) attention mask from scratch. Build a function that generates a boolean mask of shape (T, T) where position i can only attend to positions ≤ i. Apply it inside scaled dot-product attention and verify that future tokens are correctly blocked by checking the post-softmax attention weights.',
    difficulty: 'Easy',
    categoryKey: 'transformers',
    tags: ['causal-mask', 'autoregressive', 'attention', 'masking'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-7',
    title: 'Numerically Stable Softmax',
    description:
      'Implement numerically stable softmax using the log-sum-exp trick: subtract the row maximum before exponentiation to prevent overflow. Show that the naive implementation produces NaN or Inf for large logits, while yours does not. Apply both versions to attention score matrices and compare outputs.',
    difficulty: 'Easy',
    categoryKey: 'transformers',
    tags: ['softmax', 'numerical-stability', 'log-sum-exp', 'attention'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-8',
    title: 'Multi-Query Attention (MQA)',
    description:
      'Implement Multi-Query Attention where all heads share a single set of keys and values but have independent query projections. Compare memory usage and throughput against standard Multi-Head Attention at inference time. Explain how MQA reduces the KV-cache size during autoregressive generation.',
    difficulty: 'Medium',
    categoryKey: 'transformers',
    tags: ['mqa', 'kv-cache', 'inference', 'attention'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-9',
    title: 'Grouped Query Attention (GQA)',
    description:
      'Implement Grouped Query Attention, which groups query heads so that each group shares one key/value head. Parameterise the number of KV groups G and verify that G=1 reproduces MQA and G=H reproduces MHA. Measure the trade-off between model quality and KV-cache memory as G varies.',
    difficulty: 'Medium',
    categoryKey: 'transformers',
    tags: ['gqa', 'grouped-attention', 'kv-cache', 'llama'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-10',
    title: 'Attention Residual Dropout',
    description:
      'Add dropout at two points in a transformer block: (1) to the attention weight matrix after softmax, and (2) to the output of each sub-layer before the residual addition. Train a small transformer with and without each dropout strategy and plot the validation loss curves to show regularisation effects.',
    difficulty: 'Easy',
    categoryKey: 'transformers',
    tags: ['dropout', 'regularization', 'residual', 'transformer'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-11',
    title: 'FlashAttention Compatibility Layer',
    description:
      'Implement the core IO-aware attention algorithm underlying FlashAttention: tile the Q, K, V matrices into blocks that fit in SRAM and compute attention incrementally using the online softmax update rule, never materialising the full N×N attention matrix. Verify numerical equivalence with standard attention and measure peak memory usage as sequence length scales.',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['flash-attention', 'io-aware', 'memory-efficient', 'tiling'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-12',
    title: 'Decoder-Only Transformer Block',
    description:
      'Build a single decoder-only transformer block: causal multi-head self-attention → residual + layer norm → position-wise feed-forward network → residual + layer norm. Stack multiple blocks into a language model, verify that the causal mask prevents information leakage, and count parameters.',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['decoder-only', 'gpt', 'causal-attention', 'ffn'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-13',
    title: 'Encoder-Decoder Transformer Block',
    description:
      'Build a complete encoder-decoder transformer block: the encoder side uses bidirectional self-attention; the decoder side uses causal self-attention followed by cross-attention over the encoder output. Implement both blocks, wire them together, and train on a toy translation or sequence transduction task.',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['encoder-decoder', 'cross-attention', 'seq2seq', 'transformer'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-14',
    title: 'RMSNorm Implementation',
    description:
      'Implement Root Mean Square Layer Normalization (RMSNorm) from scratch: normalise by the RMS of the activations (no mean subtraction) and apply a learned scale parameter. Compare it to standard LayerNorm on a transformer training run, showing that RMSNorm achieves similar stability with fewer operations.',
    difficulty: 'Easy',
    categoryKey: 'transformers',
    tags: ['rmsnorm', 'layer-norm', 'normalization', 'llama'],
    unlocksNodeIds: [],
  },
  {
    id: 'trans-15',
    title: 'Activation Checkpointing',
    description:
      'Implement gradient checkpointing (activation recomputation) for a multi-layer transformer: during the forward pass, discard intermediate activations and recompute them on demand during the backward pass. Measure peak GPU/CPU memory with and without checkpointing across varying model depths, and quantify the compute overhead introduced.',
    difficulty: 'Hard',
    categoryKey: 'transformers',
    tags: ['checkpointing', 'memory-efficiency', 'gradient', 'training'],
    unlocksNodeIds: [],
  },

  // ─── Vision Language Models \ Multimodal ───────────────────────────────────────────────
  {
    id: 'vlm-1',
    title: 'Implement CLIP-Style Contrastive Loss from Scratch',
    description:
      'Implement the symmetric cross-entropy loss used in CLIP: given a batch of (image, text) pairs, compute the similarity matrix, apply temperature scaling, and minimise the loss so matched pairs have maximum similarity. Verify on a toy dataset.',
    difficulty: 'Hard',
    categoryKey: 'vision-language',
    tags: ['clip', 'contrastive-loss', 'vision-language', 'temperature'],
    unlocksNodeIds: ['zb~mMhhBFpFZ', '9eJnh9AiyIp9', 'cREn~kQ_h8EG'],
  },
  {
    id: 'vlm-2',
    title: 'Implement a Vision Transformer (ViT) from Scratch',
    description:
      'Break an image into patches, embed each patch as a token, add a [CLS] token and 2D positional embeddings, then pass through a standard Transformer encoder. Train on CIFAR-10 and compare with a CNN of similar parameter count.',
    difficulty: 'Hard',
    categoryKey: 'vision-language',
    tags: ['vit', 'patches', 'cls-token', 'positional-embedding'],
    unlocksNodeIds: ['m.GnrMGoHhIJ', 'qDInFEW3S4bb', 'RdJnrRADESkU'],
  },
  {
    id: 'vlm-3',
    title: 'Implement a Variational Autoencoder (VAE) from Scratch',
    description:
      'Build a VAE with an encoder that outputs μ and σ, apply the reparameterisation trick to sample a latent vector, and decode it back. Train with the ELBO loss (reconstruction + KL divergence). Generate new images by sampling from the prior.',
    difficulty: 'Hard',
    categoryKey: 'vision-language',
    tags: ['vae', 'elbo', 'reparameterisation', 'latent-space'],
    unlocksNodeIds: ['Zc~m~4VyblsZ', 'lyInSebDNjxa', 'kTHn0poIC5ex', '~vgnVSpa0YtU', 'OTHnSgkzrU9b', 'GTHnlS161Z2V'],
  },
  {
    id: 'vlm-4',
    title: 'Implement a GAN Training Loop from Scratch',
    description:
      'Build a GAN with a generator and discriminator trained adversarially. Use the non-saturating generator loss. Train on MNIST and generate convincing digit images. Document and handle mode collapse — show a training run where it occurs.',
    difficulty: 'Hard',
    categoryKey: 'vision-language',
    tags: ['gan', 'generator', 'discriminator', 'adversarial'],
    unlocksNodeIds: ['mbaniwO.cIFH', 'cc~mi6ss77WE', '6zIniWlwvtiM', 'k3~mSxeGUv-r', 'nAIn4y0GBy~4', 'QzInGBh7-mjx'],
  },
  {
    id: 'vlm-5',
    title: 'Implement a CycleGAN for Unpaired Image Translation',
    description:
      'Implement CycleGAN with two generators and two discriminators. Implement cycle-consistency loss and identity loss. Train on an unpaired dataset (e.g., horses ↔ zebras) and visualise translations both ways.',
    difficulty: 'Hard',
    categoryKey: 'vision-language',
    tags: ['cyclegan', 'unpaired', 'cycle-consistency', 'image-translation'],
    unlocksNodeIds: ['Cqan_svwW.OT', 'tbany.mWfm3f', 'FnangFKyNv0n', 'LqanO0YZWJHA', 'KoanIGoiYyr6'],
  },
  {
    id: 'vlm-6',
    title: 'ViT Patch Embedding',
    description:
      'Implement just the patch embedding stage of a Vision Transformer from scratch: divide an image into fixed-size patches, flatten each patch, and project it to the model dimension with a learned linear layer. Add a learnable [CLS] token and 1D positional embeddings. Verify that the output shape matches (N, num_patches + 1, d_model) for a batch of images.',
    difficulty: 'Medium',
    categoryKey: 'vision-language',
    tags: ['vit', 'patch-embedding', 'cls-token', 'positional-embedding'],
    unlocksNodeIds: ['vP.mK3xhT1qL'],
  },
  {
    id: 'vlm-7',
    title: 'Vision Projector',
    description:
      'Implement the vision projector (also called the visual adapter or connector) used in multimodal LLMs: a learned MLP or linear layer that maps the output of a frozen vision encoder (e.g., CLIP ViT) into the token embedding space of a language model. Train the projector on image-caption pairs while keeping both the vision encoder and LLM frozen.',
    difficulty: 'Medium',
    categoryKey: 'vision-language',
    tags: ['vision-projector', 'multimodal', 'llava', 'adapter'],
    unlocksNodeIds: ['sG.mN4kP9rXv'],
  },
  {
    id: 'vlm-8',
    title: 'Image Token Inserter',
    description:
      'Implement the mechanism that splices visual tokens into a text token sequence for a multimodal language model. Given a sequence of image patch embeddings and a text token sequence with a placeholder image token, replace the placeholder with the patch embeddings and construct the combined attention mask. Verify that the LLM processes both modalities in a single forward pass.',
    difficulty: 'Medium',
    categoryKey: 'vision-language',
    tags: ['image-tokens', 'multimodal', 'tokenization', 'llava'],
    unlocksNodeIds: ['iT.mF6qR2mWz'],
  },
  {
    id: 'vlm-9',
    title: 'SigLIP Similarity Loss',
    description:
      'Implement the SigLIP (Sigmoid Loss for Language-Image Pre-training) objective: replace CLIP\'s softmax-based contrastive loss with a pairwise sigmoid loss that treats each (image, text) pair independently. Show that this removes the dependency on large batch sizes and compare convergence speed and final linear probe accuracy against standard CLIP loss on a small image-caption dataset.',
    difficulty: 'Hard',
    categoryKey: 'vision-language',
    tags: ['siglip', 'sigmoid-loss', 'vision-language', 'contrastive'],
    unlocksNodeIds: ['sL.mR8nF2wQy'],
  },
  {
    id: 'vlm-10',
    title: 'LLaVA Fusion',
    description:
      'Build a minimal LLaVA-style multimodal model end-to-end: connect a CLIP ViT vision encoder to a small language model through a two-layer MLP vision projector. Implement the image-token insertion logic, then fine-tune only the projector on a visual question-answering dataset. Evaluate on held-out VQA pairs and compare against a text-only baseline.',
    difficulty: 'Hard',
    categoryKey: 'vision-language',
    tags: ['llava', 'multimodal', 'vision-projector', 'vqa', 'fine-tuning'],
    unlocksNodeIds: ['lV.mBnC7hEyz'],
  },

  // ─── Self-supervised Learning ─────────────────────────────────────────────
  {
    id: 'ssl-1',
    title: 'Implement SimCLR Contrastive Learning from Scratch',
    description:
      'Build SimCLR: apply two random augmentations to each image, encode both with a shared encoder, project through an MLP head, and minimise NT-Xent (normalised temperature-scaled cross-entropy) loss. Evaluate linear probe accuracy on STL-10.',
    difficulty: 'Hard',
    categoryKey: 'self-supervised',
    tags: ['simclr', 'contrastive', 'augmentation', 'nt-xent'],
    unlocksNodeIds: ['2b~mX8~K~o8D', 'eXInDqNZT_xw', 'gOfnu8V0U.QE', 'i0In.8PmQTD4', '20In8xfF2igw'],
  },
  {
    id: 'ssl-2',
    title: 'Implement a Momentum Encoder (MoCo-Style)',
    description:
      'Implement a momentum encoder that maintains an exponential moving average of the query encoder weights. Maintain a queue of negative keys. Train and evaluate using a linear probe. Explain why the momentum encoder produces more stable representations.',
    difficulty: 'Hard',
    categoryKey: 'self-supervised',
    tags: ['moco', 'momentum-encoder', 'queue', 'contrastive'],
    unlocksNodeIds: ['nOfnzVO4k_dp', 'J4In4DR78l3D', '_4In7GtoaQNs', 'J5In0HtwSH.X'],
  },
  {
    id: 'ssl-3',
    title: 'Implement a Masked Autoencoder (MAE)',
    description:
      'Implement a Masked Autoencoder: randomly mask 75% of image patches, encode only the visible patches with a ViT encoder, and reconstruct all patches with a lightweight decoder. Evaluate by fine-tuning the encoder on a classification task.',
    difficulty: 'Hard',
    categoryKey: 'self-supervised',
    tags: ['mae', 'masked-autoencoder', 'vit', 'reconstruction'],
    unlocksNodeIds: ['jc~m9RFt.AA3', 'L9Hn2T7BU8gj', 'LHInbE0geDsY', '_NInfBi_fzE~'],
  },
  {
    id: 'ssl-4',
    title: 'Implement Transfer Learning: Fine-tune a Pretrained Model',
    description:
      'Load a pretrained ResNet-50. First, run linear probing (freeze all layers, train only the head). Then, fine-tune all layers end-to-end at a low learning rate. Compare the two strategies on a small medical imaging dataset.',
    difficulty: 'Medium',
    categoryKey: 'self-supervised',
    tags: ['transfer-learning', 'fine-tuning', 'linear-probe', 'resnet'],
    unlocksNodeIds: ['INInpCYP58YA', 'fc~mAESpp2Wl', 'eMInp3leeVva', 'qSIn807su~YE'],
  },
  {
    id: 'ssl-5',
    title: 'Implement Few-Shot Learning with Prototypical Networks',
    description:
      'Implement a prototypical network for few-shot classification. During each episode, compute class prototypes by averaging support embeddings, then classify query images by nearest-prototype distance in embedding space. Evaluate on mini-ImageNet.',
    difficulty: 'Hard',
    categoryKey: 'self-supervised',
    tags: ['few-shot', 'prototypical-networks', 'meta-learning', 'embedding'],
    unlocksNodeIds: ['NMInsT6ux8Y9', 'ySInRpevwcNt'],
  },

  // ─── Graph Neural Networks ────────────────────────────────────────────────
  {
    id: 'gnn-1',
    title: 'Implement a Graph Convolutional Network (GCN) Layer from Scratch',
    description:
      'Implement a GCN layer: normalise the adjacency matrix with degree matrices (Â = D^{-1/2} A D^{-1/2}), multiply by the feature matrix and a weight matrix, then apply ReLU. Train a 2-layer GCN for node classification on the Cora citation network.',
    difficulty: 'Hard',
    categoryKey: 'graph-networks',
    tags: ['gcn', 'adjacency-matrix', 'node-classification', 'spectral'],
    unlocksNodeIds: ['N_.mQl4nd2.U', 'Ta~mtEj~FlMw', 'A-.mKWomwNar', 'vwJnNSHyoa7H'],
  },
  {
    id: 'gnn-2',
    title: 'Implement Message Passing from Scratch',
    description:
      'Build a generic message passing framework: for each node, aggregate messages from its neighbours (sum/mean/max), then update the node representation with a learned transformation. Implement it for both node-level and graph-level classification.',
    difficulty: 'Medium',
    categoryKey: 'graph-networks',
    tags: ['message-passing', 'aggregation', 'mpnn', 'graph-classification'],
    unlocksNodeIds: ['Ta~mtEj~FlMw', 'T~.mrY2kAv-9'],
  },
  {
    id: 'gnn-3',
    title: 'Implement a Graph Attention Network (GAT) Layer',
    description:
      'Implement a GAT layer where attention coefficients are computed between each node and its neighbours using a learned scoring function. Show that attention weights highlight the most informative neighbours. Evaluate on Cora vs. GCN.',
    difficulty: 'Hard',
    categoryKey: 'graph-networks',
    tags: ['gat', 'attention', 'graph', 'neighbours'],
    unlocksNodeIds: ['_a~mmd2Mvh.p'],
  },
  {
    id: 'gnn-4',
    title: 'Implement Node2Vec Graph Embeddings',
    description:
      'Implement the Node2Vec algorithm: define biased random walks that interpolate between DFS and BFS exploration (p and q parameters), then train a Skip-Gram model on the walks to learn node embeddings. Visualise the embeddings with t-SNE.',
    difficulty: 'Medium',
    categoryKey: 'graph-networks',
    tags: ['node2vec', 'random-walks', 'skip-gram', 'embeddings'],
    unlocksNodeIds: ['v7Hndu3Fvzuq', 'R2EngmB-acCf'],
  },
  {
    id: 'gnn-5',
    title: 'Demonstrate the Over-Smoothing Problem in Deep GNNs',
    description:
      'Train GCNs of depth 2, 4, 8, and 16 layers on a node classification task. Plot accuracy vs. depth and show that it degrades for very deep models. Implement two mitigation strategies (e.g., residual connections, DropEdge) and compare.',
    difficulty: 'Medium',
    categoryKey: 'graph-networks',
    tags: ['over-smoothing', 'deep-gnn', 'residual', 'node-classification'],
    unlocksNodeIds: ['_a~mmd2Mvh.p', 'T~.mrY2kAv-9'],
  },

  // ─── Training Fundamentals ────────────────────────────────────────────────
  {
    id: 'train-1',
    title: 'Implement a Full Training Loop from Scratch',
    description:
      'Build a complete training pipeline from scratch: data loading with batching and shuffling, forward pass, loss computation, backward pass, optimiser step, and validation evaluation. Add checkpointing and resume-from-checkpoint functionality.',
    difficulty: 'Medium',
    categoryKey: 'training',
    tags: ['training-loop', 'checkpointing', 'validation', 'pipeline'],
    unlocksNodeIds: ['UVCndueRufra', 'tODnB5NE1M9g', '.RDnE3Y-jVak', 'KRDnD7CM9LbW', '6YDnVei_SEAj'],
  },
  {
    id: 'train-2',
    title: 'Diagnose and Fix the Vanishing Gradient Problem',
    description:
      'Train a very deep (20-layer) MLP with sigmoid activations and record the gradient magnitudes at each layer. Observe the vanishing gradient. Then fix it by switching to ReLU activations and adding batch normalisation or residual connections.',
    difficulty: 'Medium',
    categoryKey: 'training',
    tags: ['vanishing-gradient', 'relu', 'deep-network', 'diagnosis'],
    unlocksNodeIds: ['0~YmvJJkj~MW', '0dZmIXS9MfIk', 'A.Dn8Lyoe-VV', 'ajEnDlQahS8i', 'IiEn5cDa3_jj'],
  },
  {
    id: 'train-3',
    title: 'Implement Maximum Likelihood Estimation',
    description:
      'Derive and implement MLE for a Gaussian distribution and for a logistic regression model from scratch. Show that minimising cross-entropy loss is equivalent to maximising the log-likelihood. Visualise the likelihood surface.',
    difficulty: 'Medium',
    categoryKey: 'training',
    tags: ['mle', 'likelihood', 'cross-entropy', 'logistic-regression'],
    unlocksNodeIds: ['V7YmAe59fQ2u', 'ZQCnuOMnro_G', '0jgnhxcVENU8', '2lgnjSmuoTsX'],
  },
  {
    id: 'train-4',
    title: 'Implement Residual Connections and Reproduce ResNet-Style Training',
    description:
      'Add residual connections to a plain CNN and reproduce the result from He et al.: the residual network trains better at 20, 56, and 110 layers than the plain counterpart. Plot training loss and test error vs. depth for both architectures.',
    difficulty: 'Hard',
    categoryKey: 'training',
    tags: ['resnet', 'residual-connections', 'degradation-problem', 'deep-network'],
    unlocksNodeIds: ['H39mdO~EdCth', '-29mz_svG2X9', 'j~9mJ6ga1FgF', '579m.~kufsFE', 'q-9mza.-61TV'],
  },
  {
    id: 'train-5',
    title: 'Implement and Analyse Empirical Risk Minimisation',
    description:
      'Implement a training framework that computes both training loss and an empirical generalisation bound (Rademacher complexity or VC bound). Show how the bound tightens as sample size grows and how model complexity affects the bound.',
    difficulty: 'Hard',
    categoryKey: 'training',
    tags: ['erm', 'generalisation-bound', 'rademacher', 'sample-complexity'],
    unlocksNodeIds: ['rWCnQtvs6qhX', 'jdZmx4n2rhnG'],
  },

  // ─── Advanced Topics ──────────────────────────────────────────────────────
  {
    id: 'adv-1',
    title: 'Implement a Diffusion Model Forward Process',
    description:
      'Implement the DDPM forward noising process from scratch: progressively add Gaussian noise over T timesteps using a learned noise schedule. Implement the reverse denoising step with a U-Net noise predictor. Generate images from Gaussian noise.',
    difficulty: 'Hard',
    categoryKey: 'advanced',
    tags: ['diffusion', 'ddpm', 'noise-schedule', 'denoising'],
    unlocksNodeIds: ['57DnUiL_dIpt', 'dd~mjE62I-vq', 'JXfnpY8r5ub5'],
  },
  {
    id: 'adv-2',
    title: 'Implement Word2Vec (Skip-Gram) from Scratch',
    description:
      'Implement the Skip-Gram model with negative sampling from scratch in NumPy. Train on a text corpus, then visualise the learned word embeddings with t-SNE. Demonstrate analogical reasoning: king − man + woman ≈ queen.',
    difficulty: 'Medium',
    categoryKey: 'advanced',
    tags: ['word2vec', 'skip-gram', 'negative-sampling', 'embeddings'],
    unlocksNodeIds: ['R2EngmB-acCf', 'v7Hndu3Fvzuq'],
  },
  {
    id: 'adv-3',
    title: 'Implement Neural Scaling Laws Experiment',
    description:
      'Train language models of 4 different sizes (10M, 50M, 200M, 500M parameters) on the same dataset. Plot test loss vs. compute (FLOPs) and vs. model size. Fit a power law to the data and extrapolate to estimate performance at larger scale.',
    difficulty: 'Hard',
    categoryKey: 'advanced',
    tags: ['scaling-laws', 'compute', 'power-law', 'language-model'],
    unlocksNodeIds: ['Q8DnWJ.103aX'],
  },
  {
    id: 'adv-4',
    title: 'Build a Simple Image Captioning Model',
    description:
      'Combine a pretrained CNN encoder (feature extractor) with a Transformer decoder to build an image captioning model. Train with teacher forcing on COCO captions. At inference, generate captions autoregressively with beam search.',
    difficulty: 'Hard',
    categoryKey: 'advanced',
    tags: ['image-captioning', 'cnn', 'transformer', 'beam-search'],
    unlocksNodeIds: ['YfEn2HJh8Q2n', '6fEnrMzvdcru', 'g8DnDxNenAyY'],
  },
  {
    id: 'adv-5',
    title: 'Implement Adversarial Training and Evaluate Robustness',
    description:
      'Implement FGSM (Fast Gradient Sign Method) to generate adversarial examples from a trained image classifier. Then apply adversarial training: include adversarial examples in each training batch. Measure accuracy on clean and adversarial test sets before and after.',
    difficulty: 'Hard',
    categoryKey: 'advanced',
    tags: ['adversarial-training', 'fgsm', 'robustness', 'perturbations'],
    unlocksNodeIds: ['fcanKtuRjwxY', 'BcanMDJuwpv4', 'zcanFZFmrmmC'],
  },
]

// Index by category for fast lookup
export const problemsByCategory: Record<string, Problem[]> = {}
for (const p of problems) {
  if (!problemsByCategory[p.categoryKey]) problemsByCategory[p.categoryKey] = []
  problemsByCategory[p.categoryKey].push(p)
}
