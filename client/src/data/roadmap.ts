export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  children?: RoadmapItem[];
  resources?: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book' | 'documentation';
}

export const roadmapData: RoadmapItem[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    description: 'Core mathematical concepts essential for understanding deep learning',
    children: [
      {
        id: 'linear-algebra',
        title: 'Linear Algebra',
        description: 'Mathematical operations on vectors and matrices',
        children: [
          {
            id: 'matrices-vectors',
            title: 'Matrices and Vectors',
            description: 'Understanding matrix operations, vector spaces, and transformations',
          },
          {
            id: 'eigenvalues',
            title: 'Eigenvalues and Eigenvectors',
            description: 'Special values and vectors that characterize linear transformations',
          },
          {
            id: 'matrix-operations',
            title: 'Matrix Operations',
            description: 'Addition, multiplication, transpose, inverse, and decomposition',
          },
        ],
      },
      {
        id: 'calculus',
        title: 'Calculus',
        description: 'Mathematical concepts for optimization and learning',
        children: [
          {
            id: 'derivatives',
            title: 'Derivatives',
            description: 'Rate of change and slope calculations',
          },
          {
            id: 'gradients',
            title: 'Gradients',
            description: 'Multi-dimensional derivatives for optimization',
          },
          {
            id: 'chain-rule',
            title: 'Chain Rule',
            description: 'Computing derivatives of composed functions',
          },
        ],
      },
      {
        id: 'probability-statistics',
        title: 'Probability and Statistics',
        description: 'Understanding uncertainty and data distributions',
        children: [
          {
            id: 'probability-distributions',
            title: 'Probability Distributions',
            description: 'Normal, binomial, Poisson, and other distributions',
          },
          {
            id: 'bayesian-statistics',
            title: 'Bayesian Statistics',
            description: 'Probabilistic reasoning and Bayes theorem',
          },
          {
            id: 'statistical-inference',
            title: 'Statistical Inference',
            description: 'Making predictions and drawing conclusions from data',
          },
        ],
      },
    ],
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    description: 'Basic building blocks of deep learning',
    children: [
      {
        id: 'perceptron',
        title: 'Perceptron',
        description: 'The simplest form of a neural network',
      },
      {
        id: 'activation-functions',
        title: 'Activation Functions',
        description: 'Non-linear functions that introduce complexity',
        children: [
          {
            id: 'sigmoid',
            title: 'Sigmoid',
            description: 'S-shaped curve that maps values to (0,1)',
          },
          {
            id: 'relu',
            title: 'ReLU',
            description: 'Rectified Linear Unit - most popular activation function',
          },
          {
            id: 'tanh',
            title: 'Tanh',
            description: 'Hyperbolic tangent mapping to (-1,1)',
          },
        ],
      },
      {
        id: 'backpropagation',
        title: 'Backpropagation',
        description: 'Algorithm for computing gradients through the network',
      },
      {
        id: 'loss-functions',
        title: 'Loss Functions',
        description: 'Measuring how well the model performs',
        children: [
          {
            id: 'mse',
            title: 'MSE',
            description: 'Mean Squared Error for regression tasks',
          },
          {
            id: 'cross-entropy',
            title: 'Cross-Entropy',
            description: 'Loss function for classification problems',
          },
        ],
      },
    ],
  },
  {
    id: 'deep-learning-architectures',
    title: 'Deep Learning Architectures',
    description: 'Advanced neural network structures',
    children: [
      {
        id: 'cnn',
        title: 'Convolutional Neural Networks (CNN)',
        description: 'Specialized for processing grid-like data (images)',
        children: [
          {
            id: 'convolutional-layers',
            title: 'Convolutional Layers',
            description: 'Apply filters to extract features from images',
          },
          {
            id: 'pooling-layers',
            title: 'Pooling Layers',
            description: 'Reduce spatial dimensions while preserving important features',
          },
          {
            id: 'fully-connected-layers',
            title: 'Fully Connected Layers',
            description: 'Connect all neurons for final classification',
          },
        ],
      },
      {
        id: 'rnn',
        title: 'Recurrent Neural Networks (RNN)',
        description: 'Networks for sequential data',
        children: [
          {
            id: 'lstm',
            title: 'LSTM',
            description: 'Long Short-Term Memory - handles long-term dependencies',
          },
          {
            id: 'gru',
            title: 'GRU',
            description: 'Gated Recurrent Unit - simpler alternative to LSTM',
          },
        ],
      },
      {
        id: 'transformers',
        title: 'Transformers',
        description: 'State-of-the-art architecture for many tasks',
        children: [
          {
            id: 'attention-mechanism',
            title: 'Attention Mechanism',
            description: 'Focus on relevant parts of the input',
          },
          {
            id: 'self-attention',
            title: 'Self-Attention',
            description: 'Attention within the same sequence',
          },
          {
            id: 'multi-head-attention',
            title: 'Multi-Head Attention',
            description: 'Multiple attention mechanisms in parallel',
          },
        ],
      },
    ],
  },
  {
    id: 'training-optimization',
    title: 'Training and Optimization',
    description: 'Techniques to train neural networks effectively',
    children: [
      {
        id: 'gradient-descent',
        title: 'Gradient Descent',
        description: 'Core optimization algorithm',
        children: [
          {
            id: 'sgd',
            title: 'Stochastic Gradient Descent',
            description: 'Update weights with individual samples',
          },
          {
            id: 'mini-batch',
            title: 'Mini-batch Gradient Descent',
            description: 'Update weights with small batches',
          },
        ],
      },
      {
        id: 'optimizers',
        title: 'Optimizers',
        description: 'Advanced optimization algorithms',
        children: [
          {
            id: 'adam',
            title: 'Adam',
            description: 'Adaptive Moment Estimation - most popular optimizer',
          },
          {
            id: 'rmsprop',
            title: 'RMSprop',
            description: 'Root Mean Square Propagation',
          },
          {
            id: 'momentum',
            title: 'Momentum',
            description: 'Accelerate gradient descent with velocity',
          },
        ],
      },
      {
        id: 'regularization',
        title: 'Regularization',
        description: 'Prevent overfitting',
        children: [
          {
            id: 'dropout',
            title: 'Dropout',
            description: 'Randomly disable neurons during training',
          },
          {
            id: 'l1-l2',
            title: 'L1/L2 Regularization',
            description: 'Add penalty terms to the loss function',
          },
          {
            id: 'batch-normalization',
            title: 'Batch Normalization',
            description: 'Normalize layer inputs for stable training',
          },
        ],
      },
    ],
  },
  {
    id: 'applications',
    title: 'Applications',
    description: 'Real-world uses of deep learning',
    children: [
      {
        id: 'computer-vision',
        title: 'Computer Vision',
        description: 'Teaching computers to see and understand images',
        children: [
          {
            id: 'image-classification',
            title: 'Image Classification',
            description: 'Categorizing images into predefined classes',
          },
          {
            id: 'object-detection',
            title: 'Object Detection',
            description: 'Locating and identifying objects in images',
          },
          {
            id: 'image-segmentation',
            title: 'Image Segmentation',
            description: 'Pixel-level classification of images',
          },
        ],
      },
      {
        id: 'nlp',
        title: 'Natural Language Processing',
        description: 'Understanding and generating human language',
        children: [
          {
            id: 'text-classification',
            title: 'Text Classification',
            description: 'Categorizing text documents',
          },
          {
            id: 'machine-translation',
            title: 'Machine Translation',
            description: 'Translating text between languages',
          },
          {
            id: 'question-answering',
            title: 'Question Answering',
            description: 'Systems that answer questions about text',
          },
        ],
      },
      {
        id: 'reinforcement-learning',
        title: 'Reinforcement Learning',
        description: 'Learning through interaction with an environment',
        children: [
          {
            id: 'q-learning',
            title: 'Q-Learning',
            description: 'Learning action-value functions',
          },
          {
            id: 'policy-gradients',
            title: 'Policy Gradients',
            description: 'Directly learning the policy function',
          },
          {
            id: 'dqn',
            title: 'Deep Q-Networks',
            description: 'Combining Q-learning with deep neural networks',
          },
        ],
      },
    ],
  },
];
