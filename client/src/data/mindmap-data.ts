// Parsed from The Great Deep Learning Tree.csv
export interface MindMapNode {
  id: string;
  name: string;
  parentId: string | null;
}

export const mindMapNodes: MindMapNode[] = [
  { id: "yq1G2-Rxt0Qn", name: "Deep Learning", parentId: null },
  { id: "yq1GFhXlfYAQ", name: "Neural Networks", parentId: "yq1G2-Rxt0Qn" },
  { id: "C6Ym-lLJ0fzz", name: "Perceptron", parentId: "yq1G2-Rxt0Qn" },
  { id: "Xq1GfzB5.WGg", name: "Convolutional Neural Networks (CNNs)", parentId: "yq1GFhXlfYAQ" },
  { id: "Qr1GhPWOA-.Q", name: "Recurrent Neural Networks (RNNs)", parentId: "yq1GFhXlfYAQ" },
  { id: "l~Ymz8FByu5m", name: "8 Optimization Algorithms", parentId: "yq1G2-Rxt0Qn" },
  { id: "n5YmXLaYY8WP", name: "Regularization Techniques", parentId: "yq1G2-Rxt0Qn" },
  { id: "yq1GqjMt5lBT", name: "Transformers & Attention", parentId: "yq1G2-Rxt0Qn" },
  { id: "zb~mMhhBFpFZ", name: "Vision Language Models (VLMs)", parentId: "yq1G2-Rxt0Qn" },
  { id: "2b~mX8~K~o8D", name: "Self-supervised Learning", parentId: "yq1G2-Rxt0Qn" },
  { id: "N_.mQl4nd2.U", name: "Graph Neural Networks", parentId: "yq1G2-Rxt0Qn" },
  { id: "UVCndueRufra", name: "Training Fundamentals", parentId: "yq1G2-Rxt0Qn" },
  { id: "57DnUiL_dIpt", name: "Advanced Topics", parentId: "yq1G2-Rxt0Qn" },
  
  // Perceptron children
  { id: "k6CnIM8fO3B1", name: "Linear classifier", parentId: "C6Ym-lLJ0fzz" },
  { id: "35CnDh75grug", name: "Predecessor to Neural nets", parentId: "C6Ym-lLJ0fzz" },
  { id: "h9CnbQBtv9.d", name: "How it works", parentId: "C6Ym-lLJ0fzz" },
  { id: "o-YmDk9YpuUP", name: "Multi-Layer Perceptron (MLP)", parentId: "C6Ym-lLJ0fzz" },
  { id: ".WDn6_vJi67r", name: "Non-linearly separable data can be classified", parentId: "C6Ym-lLJ0fzz" },
  
  // MLP children
  { id: "5-Ym3U15k9Qi", name: "Complex Decision Boundaries", parentId: "o-YmDk9YpuUP" },
  { id: "gzDnZTkeCRqz", name: "Fully connected", parentId: "o-YmDk9YpuUP" },
  { id: "G_Ymzn83_uSA", name: "Back-propagation Algorithm", parentId: "o-YmDk9YpuUP" },
  
  // CNN children
  { id: "_G8mKvDKVkTy", name: "Good for Image Classification", parentId: "Xq1GfzB5.WGg" },
  { id: "BlEncB4j2Rw7", name: "Core Components", parentId: "Xq1GfzB5.WGg" },
  { id: "Ya-mJv2txt_I", name: "Deep CNNs", parentId: "Xq1GfzB5.WGg" },
  { id: "Mc~m1WpMKkA8", name: "U-Net Architecture", parentId: "Xq1GfzB5.WGg" },
  { id: "H39mdO~EdCth", name: "Residual Connections", parentId: "Xq1GfzB5.WGg" },
  
  // CNN advantages
  { id: "nT8m6-AViuhz", name: "Local Connectivity", parentId: "_G8mKvDKVkTy" },
  { id: "sP8mWnhryEbM", name: "Parameter Sharing", parentId: "_G8mKvDKVkTy" },
  { id: "FV8mkTi86cm6", name: "Adaptability to different image sizes", parentId: "_G8mKvDKVkTy" },
  
  { id: "mX8msuVne4_J", name: "Detection of Local Patterns", parentId: "nT8m6-AViuhz" },
  { id: "8b9mXHE7SEye", name: "Translational Invariance", parentId: "nT8m6-AViuhz" },
  { id: "4W8muL-bC75L", name: "Reduction of Parameters", parentId: "nT8m6-AViuhz" },
  
  { id: "n.8mpJfiFeC_", name: "Translational Invariance", parentId: "sP8mWnhryEbM" },
  { id: "138mBH5vo~Gc", name: "Improves learning efficiency", parentId: "sP8mWnhryEbM" },
  
  // CNN components
  { id: "xI9mBcLtUpbI", name: "Feature Map", parentId: "BlEncB4j2Rw7" },
  { id: "ji9mt5spW4EA", name: "Convolutions over volumes", parentId: "BlEncB4j2Rw7" },
  { id: "2c9mo7X-SJR1", name: "Pooling Layers", parentId: "BlEncB4j2Rw7" },
  { id: "CcEnu0jPl5zu", name: "Normalization Layers", parentId: "BlEncB4j2Rw7" },
  { id: "5g9mQqT_PaJh", name: "Padding", parentId: "BlEncB4j2Rw7" },
  
  { id: "IJ9mtlN8cDVG", name: "Created by convolving a filter", parentId: "xI9mBcLtUpbI" },
  { id: "Km9mXXqHkzs5", name: "Multiple Filters", parentId: "ji9mt5spW4EA" },
  
  { id: "oy9mIK133hLe", name: "Advantages", parentId: "2c9mo7X-SJR1" },
  { id: "ty9mDXPOrykP", name: "Downsample feature maps", parentId: "oy9mIK133hLe" },
  { id: "0d9mPlM36hhP", name: "Helps focus on presence not location", parentId: "oy9mIK133hLe" },
  { id: "Xy9mxtb-J0Z2", name: "Improves efficiency", parentId: "oy9mIK133hLe" },
  { id: "6f9mSKfgZ~IH", name: "Mean pooling", parentId: "2c9mo7X-SJR1" },
  
  { id: "RcEnEW52Bixp", name: "Batch Norm", parentId: "CcEnu0jPl5zu" },
  { id: "ZcEnd-Q.PeyS", name: "Layer Norm", parentId: "CcEnu0jPl5zu" },
  { id: "by8mIqtiGzbv", name: "Other Normalization", parentId: "CcEnu0jPl5zu" },
  
  { id: "lr8m0pCiOYVT", name: "Batch Normalization Benefits", parentId: "RcEnEW52Bixp" },
  { id: "zt8mUUJMUa3Q", name: "Enables larger learning rate", parentId: "lr8m0pCiOYVT" },
  { id: "rE9mzL7_A.IC", name: "Improves training stability", parentId: "lr8m0pCiOYVT" },
  { id: ".r8m0jaG-pDo", name: "Ensures similar feature scale", parentId: "lr8m0pCiOYVT" },
  
  { id: "3u8m8B2fTFEH", name: "Noise scales with learning rate", parentId: "zt8mUUJMUa3Q" },
  { id: "Wt8mVHg.fZNE", name: "Improves generalization", parentId: "zt8mUUJMUa3Q" },
  
  { id: "2v8mPwueRtfK", name: "Benefits", parentId: "by8mIqtiGzbv" },
  { id: "mw8mbi0tLUlH", name: "Instance norm", parentId: "by8mIqtiGzbv" },
  { id: "dw8mMcl0zggI", name: "Layer norm", parentId: "by8mIqtiGzbv" },
  { id: "uw8mJzojtRd4", name: "Group Norm", parentId: "by8mIqtiGzbv" },
  
  { id: "fpHnfE~ZYVWt", name: "Padding of 0's", parentId: "5g9mQqT_PaJh" },
  { id: "-oHn0__-1GeK", name: "Padding of 1's", parentId: "5g9mQqT_PaJh" },
  
  // Deep CNNs
  { id: "ab-mut.VdsGc", name: "Outperforms shallow CNNs", parentId: "Ya-mJv2txt_I" },
  { id: "pb-mxitFzKha", name: "Stochastic Depth", parentId: "Ya-mJv2txt_I" },
  { id: "b~DnTZS9SUQA", name: "Reduces Overfitting", parentId: "pb-mxitFzKha" },
  
  // Residual Connections
  { id: "-29mz_svG2X9", name: "Benefits", parentId: "H39mdO~EdCth" },
  { id: "j~9mJ6ga1FgF", name: "Add output of previous layer", parentId: "H39mdO~EdCth" },
  { id: "-_9maBAK7azj", name: "Dense Networks", parentId: "H39mdO~EdCth" },
  
  { id: "579m.~kufsFE", name: "Mitigate vanishing gradient", parentId: "-29mz_svG2X9" },
  { id: "q-9mza.-61TV", name: "Encourages feature reuse", parentId: "-29mz_svG2X9" },
  { id: "q89mShlsClPO", name: "Makes deeper networks easier", parentId: "-29mz_svG2X9" },
  
  { id: "G~9mjkHxEwIf", name: "Dense connections", parentId: "-_9maBAK7azj" },
  { id: "M~9m6zbpZLIU", name: "Concatenate outputs", parentId: "-_9maBAK7azj" },
  { id: "xa-mys8DIG_O", name: "Makes training easier", parentId: "-_9maBAK7azj" },
  
  // U-Net
  { id: "OS~mgWOuB~m4", name: "Skip connections", parentId: "Mc~m1WpMKkA8" },
  { id: "lT~mEEyORhAe", name: "Benefits", parentId: "OS~mgWOuB~m4" },
  { id: "aT~mYBjyxnQU", name: "Hourglass Architecture", parentId: "OS~mgWOuB~m4" },
  { id: ".AIn2op4-Rhc", name: "Skip connections allow...", parentId: "Mc~m1WpMKkA8" },
  
  { id: "vU~mPYY_w54g", name: "Improve prediction quality", parentId: "lT~mEEyORhAe" },
  { id: "lBInC3Ci0Xwm", name: "Combining features", parentId: ".AIn2op4-Rhc" },
  { id: "DBInS3uK5K~q", name: "Better gradient flow", parentId: ".AIn2op4-Rhc" },
  
  { id: ".T~m3vbMQGhd", name: "Increase receptive field", parentId: "aT~mYBjyxnQU" },
  { id: "0T~m-.URmtDe", name: "Improve efficiency", parentId: "aT~mYBjyxnQU" },
  
  // RNN children
  { id: "Qu~mclIEc4d8", name: "Pros", parentId: "Qr1GhPWOA-.Q" },
  { id: "tT.m2aWSFPcv", name: "Cons", parentId: "Qr1GhPWOA-.Q" },
  { id: "Ek~m~tgKEwiH", name: "Hidden State", parentId: "Qr1GhPWOA-.Q" },
  { id: "zV.mvPFb4E_O", name: "LSTM & Advanced RNNs", parentId: "Qr1GhPWOA-.Q" },
  
  { id: "6X.mEVOPFRIW", name: "Variable length sequences", parentId: "Qu~mclIEc4d8" },
  { id: "zv~m_8jgIJYl", name: "Weight sharing across time", parentId: "Qu~mclIEc4d8" },
  { id: "4u~mJQqDz~sz", name: "Model size doesn't increase", parentId: "Qu~mclIEc4d8" },
  
  { id: "LT.mQEcqJ_Rx", name: "Rewrites hidden states", parentId: "tT.m2aWSFPcv" },
  { id: "YX.mjlsO-V2Z", name: "Hard to train", parentId: "tT.m2aWSFPcv" },
  { id: "Yv~memkUToys", name: "Vanishing gradient", parentId: "tT.m2aWSFPcv" },
  
  // LSTM
  { id: "IW.m~AD~ARY-", name: "Components", parentId: "zV.mvPFb4E_O" },
  { id: "ZW.mHXAHwrNV", name: "Mitigates vanishing gradient", parentId: "zV.mvPFb4E_O" },
  { id: "oFInQklGdUx-", name: "LSTM with Attention", parentId: "zV.mvPFb4E_O" },
  { id: "Z4.m5HY7AjWk", name: "Bidirectional LSTM", parentId: "zV.mvPFb4E_O" },
  
  { id: "ll~m7v~7KBMU", name: "Hidden State", parentId: "IW.m~AD~ARY-" },
  { id: "mW.mV4otupen", name: "Output gate", parentId: "IW.m~AD~ARY-" },
  
  { id: "Y5.m3r~K4qf3", name: "Bottleneck Problem", parentId: "Z4.m5HY7AjWk" },
  
  { id: "BFInMmyl7G21", name: "Encoder-Decoder", parentId: "oFInQklGdUx-" },
  { id: "4Y.mDKFls_HP", name: "Attention Benefits", parentId: "oFInQklGdUx-" },
  
  { id: "W7HnvPoDsCsi", name: "No fixed-dimensional vector", parentId: "4Y.mDKFls_HP" },
  { id: "V2.mFc53Jx2Z", name: "Parallelizable", parentId: "4Y.mDKFls_HP" },
  { id: "B1.mQsRz0UDx", name: "Helpful for long sequences", parentId: "4Y.mDKFls_HP" },
  
  // Transformers
  { id: "GmEndfG64YOX", name: "Types of Attentions", parentId: "yq1GqjMt5lBT" },
  { id: "PtInHHGPYS6P", name: "Masked self attention", parentId: "GmEndfG64YOX" },
  { id: "j9.mMpMKdJY8", name: "BERT", parentId: "yq1GqjMt5lBT" },
  { id: "F9.mfP7V5HWB", name: "GPT (Decoders only)", parentId: "yq1GqjMt5lBT" },
  
  { id: "8uInCWaVmC~E", name: "Masked language modeling", parentId: "j9.mMpMKdJY8" },
  { id: "VVfn9NhMBO9e", name: "Next sentence prediction", parentId: "j9.mMpMKdJY8" },
  
  { id: "REInEyzfgUlk", name: "Decoders only", parentId: "F9.mfP7V5HWB" },
  { id: "DVfnF_o-Y9fm", name: "Next word prediction", parentId: "F9.mfP7V5HWB" },
  
  // Vision Language Models
  { id: "m.GnrMGoHhIJ", name: "Vision Transformer (ViT)", parentId: "zb~mMhhBFpFZ" },
  { id: "Zc~m~4VyblsZ", name: "Variational Auto Encoders", parentId: "zb~mMhhBFpFZ" },
  { id: "dd~mjE62I-vq", name: "Diffusion Models", parentId: "zb~mMhhBFpFZ" },
  { id: "mbaniwO.cIFH", name: "GANs & CycleGAN", parentId: "zb~mMhhBFpFZ" },
  
  { id: "9eJnh9AiyIp9", name: "CLIP", parentId: "m.GnrMGoHhIJ" },
  { id: "qDInFEW3S4bb", name: "Single resolution limitation", parentId: "m.GnrMGoHhIJ" },
  { id: "RdJnrRADESkU", name: "Hierarchical ViT", parentId: "m.GnrMGoHhIJ" },
  
  { id: "seJnc5MnFOS7", name: "Minimal data augmentation", parentId: "RdJnrRADESkU" },
  
  // VAE
  { id: "~vgnVSpa0YtU", name: "Latent Space", parentId: "Zc~m~4VyblsZ" },
  { id: "nVHni5zJ6Gdo", name: "Generator reconstructs input", parentId: "Zc~m~4VyblsZ" },
  { id: "lyInSebDNjxa", name: "Reparametrization trick", parentId: "Zc~m~4VyblsZ" },
  { id: "kTHn0poIC5ex", name: "ELBO", parentId: "Zc~m~4VyblsZ" },
  { id: "XUfnfeHDyTQ0", name: "Hierarchical VAEs", parentId: "Zc~m~4VyblsZ" },
  
  { id: "OTHnSgkzrU9b", name: "Prior Matching Term", parentId: "kTHn0poIC5ex" },
  { id: "GTHnlS161Z2V", name: "Reconstruction Term", parentId: "kTHn0poIC5ex" },
  
  // Diffusion
  { id: "JXfnpY8r5ub5", name: "Latent Diffusion", parentId: "dd~mjE62I-vq" },
  
  // GANs
  { id: "cc~mi6ss77WE", name: "Standard GAN", parentId: "mbaniwO.cIFH" },
  { id: "Cqan_svwW.OT", name: "CycleGAN", parentId: "mbaniwO.cIFH" },
  { id: "tbany.mWfm3f", name: "Unpaired translation", parentId: "mbaniwO.cIFH" },
  { id: "UeanKkaxTww8", name: "Fool discriminator", parentId: "mbaniwO.cIFH" },
  { id: "KoanIGoiYyr6", name: "2 discriminators", parentId: "mbaniwO.cIFH" },
  { id: "6zIniWlwvtiM", name: "Training", parentId: "mbaniwO.cIFH" },
  
  { id: "fcanKtuRjwxY", name: "Limitations", parentId: "cc~mi6ss77WE" },
  { id: "BcanMDJuwpv4", name: "Not guaranteed to converge", parentId: "fcanKtuRjwxY" },
  { id: "reanJQW9e8x0", name: "Mode collapse", parentId: "fcanKtuRjwxY" },
  { id: "zcanFZFmrmmC", name: "Hard to optimize", parentId: "fcanKtuRjwxY" },
  
  { id: "FnangFKyNv0n", name: "Cycle consistency", parentId: "Cqan_svwW.OT" },
  { id: "LqanO0YZWJHA", name: "Direct Translation", parentId: "Cqan_svwW.OT" },
  
  { id: "k3~mSxeGUv-r", name: "Generator Training", parentId: "6zIniWlwvtiM" },
  { id: "nAIn4y0GBy~4", name: "Discriminator - minimize loss", parentId: "6zIniWlwvtiM" },
  { id: "QzInGBh7-mjx", name: "Generator - maximize loss", parentId: "6zIniWlwvtiM" },
  
  { id: "n8~mnnbaUtQ8", name: "Use negative discriminator loss", parentId: "k3~mSxeGUv-r" },
  
  // Self-supervised Learning
  { id: "jc~m9RFt.AA3", name: "Self-supervised", parentId: "2b~mX8~K~o8D" },
  { id: "fc~mAESpp2Wl", name: "Pretraining", parentId: "2b~mX8~K~o8D" },
  { id: "INInpCYP58YA", name: "Transfer Learning", parentId: "2b~mX8~K~o8D" },
  { id: "NMInsT6ux8Y9", name: "Few shot learning", parentId: "2b~mX8~K~o8D" },
  { id: "v2~m0p-MQ9xd", name: "Generative Models", parentId: "2b~mX8~K~o8D" },
  { id: "cREn~kQ_h8EG", name: "CLIP", parentId: "2b~mX8~K~o8D" },
  { id: "eXInDqNZT_xw", name: "Contrastive Algorithms", parentId: "2b~mX8~K~o8D" },
  
  { id: "L9Hn2T7BU8gj", name: "Advantages", parentId: "jc~m9RFt.AA3" },
  { id: "cRIn03zbpe-7", name: "How to evaluate?", parentId: "jc~m9RFt.AA3" },
  { id: "_NInfBi_fzE~", name: "Why self-supervised?", parentId: "jc~m9RFt.AA3" },
  
  { id: "LHInbE0geDsY", name: "Scales well", parentId: "L9Hn2T7BU8gj" },
  { id: "T9HnCQAniTt7", name: "Works with unlabeled data", parentId: "L9Hn2T7BU8gj" },
  
  { id: "qSIn807su~YE", name: "Feature extractor", parentId: "cRIn03zbpe-7" },
  { id: "ySInRpevwcNt", name: "Supervised with small target data", parentId: "cRIn03zbpe-7" },
  
  { id: "GOInWeHwt-sh", name: "Easier to get unlabeled data", parentId: "_NInfBi_fzE~" },
  { id: "tOInC.eJRqul", name: "Not all images labeled", parentId: "_NInfBi_fzE~" },
  
  { id: "eMInp3leeVva", name: "Example: ImageNet", parentId: "fc~mAESpp2Wl" },
  
  // Contrastive
  { id: "gOfnu8V0U.QE", name: "SimCLR", parentId: "eXInDqNZT_xw" },
  { id: "nOfnzVO4k_dp", name: "MoCo", parentId: "eXInDqNZT_xw" },
  { id: "MXInBJNpndzY", name: "Triplet loss function", parentId: "eXInDqNZT_xw" },
  
  { id: "i0In.8PmQTD4", name: "Apply base encoder", parentId: "gOfnu8V0U.QE" },
  { id: "20In8xfF2igw", name: "SimCLR Loss", parentId: "gOfnu8V0U.QE" },
  { id: "82Inqr6~p.et", name: "Use hi, hj for downstream", parentId: "gOfnu8V0U.QE" },
  
  { id: "J4In4DR78l3D", name: "Cache negative samples", parentId: "nOfnzVO4k_dp" },
  { id: "_4In7GtoaQNs", name: "Exponential moving average", parentId: "nOfnzVO4k_dp" },
  { id: "J5In0HtwSH.X", name: "MoCo v2 outperforms SimCLR", parentId: "nOfnzVO4k_dp" },
  
  // Graph Neural Networks
  { id: "T~.mrY2kAv-9", name: "Homophily", parentId: "N_.mQl4nd2.U" },
  { id: "Ta~mtEj~FlMw", name: "Transform & aggregate", parentId: "N_.mQl4nd2.U" },
  { id: "_a~mmd2Mvh.p", name: "Oversmooth problem", parentId: "N_.mQl4nd2.U" },
  { id: "A-.mKWomwNar", name: "Permutation Invariance", parentId: "N_.mQl4nd2.U" },
  
  { id: "vwJnNSHyoa7H", name: "Graph invariant under relabeling", parentId: "A-.mKWomwNar" },
  
  // Optimization Algorithms
  { id: "6~YmPkqky.70", name: "Stochastic Gradient Descent", parentId: "l~Ymz8FByu5m" },
  { id: "yiZmhj4NWGez", name: "Mini-batch SGD", parentId: "l~Ymz8FByu5m" },
  { id: "caZmu3d3kpDu", name: "SGD w/ momentum", parentId: "l~Ymz8FByu5m" },
  { id: "kaZmIe~NN-_l", name: "AdaGrad", parentId: "l~Ymz8FByu5m" },
  { id: "uaZmMUpp.qbc", name: "RMSProp", parentId: "l~Ymz8FByu5m" },
  { id: "LaZmI--VUCjE", name: "Adam", parentId: "l~Ymz8FByu5m" },
  { id: "vo8mF9JfowCG", name: "AdamW", parentId: "l~Ymz8FByu5m" },
  
  { id: "1vEnSZ2y2A44", name: "Single data point per iteration", parentId: "6~YmPkqky.70" },
  { id: "Sg8mfZ4hieTj", name: "Faster than GD", parentId: "6~YmPkqky.70" },
  { id: "6gZmduZ4qLun", name: "Problems", parentId: "6~YmPkqky.70" },
  
  { id: "TBEnTu~VvR5k", name: "Introduces variability", parentId: "1vEnSZ2y2A44" },
  
  { id: "deZmxIrqixmC", name: "Too expensive for large datasets", parentId: "6gZmduZ4qLun" },
  { id: "1hZmvOsn8iD~", name: "Solution: Minibatch SGD", parentId: "6gZmduZ4qLun" },
  { id: "PEEn4ep4_hFJ", name: "High variance in gradient", parentId: "6gZmduZ4qLun" },
  { id: "DFEnC3S3tZ~p", name: "May oscillate", parentId: "6gZmduZ4qLun" },
  { id: ".gZmFYUD3PkD", name: "Tradeoff convergence", parentId: "6gZmduZ4qLun" },
  
  { id: "OeZmNZs-XHFW", name: "Computes full gradient", parentId: "deZmxIrqixmC" },
  
  { id: "dGEnK37aV0gL", name: "Problems", parentId: "yiZmhj4NWGez" },
  { id: "qYEnyYK42zXp", name: "Still faster than GD", parentId: "yiZmhj4NWGez" },
  
  { id: "-GEn5h~KSH7E", name: "Requires tuning batch-size", parentId: "dGEnK37aV0gL" },
  
  { id: "z0EnXaoh99vL", name: "How it works: momentum", parentId: "caZmu3d3kpDu" },
  { id: "ZHEnywp0..uc", name: "Problems", parentId: "caZmu3d3kpDu" },
  { id: "1mZmwmK7FRH-", name: "Converges faster than SGD", parentId: "caZmu3d3kpDu" },
  { id: "qa8mBjVM5YQG", name: "Good for non-convex", parentId: "caZmu3d3kpDu" },
  
  { id: "gIEn2qAcLAM~", name: "More parameters to tune", parentId: "ZHEnywp0..uc" },
  { id: "4HEnb-AmXiQ7", name: "May overshoot min", parentId: "ZHEnywp0..uc" },
  
  { id: "2JEnQqyt61em", name: "Problems", parentId: "kaZmIe~NN-_l" },
  { id: "GNEnF-lKGgTI", name: "Adapting learning rate", parentId: "kaZmIe~NN-_l" },
  
  { id: "8JEn4uDfmEGt", name: "Exploding denominator", parentId: "2JEnQqyt61em" },
  { id: "Y8Ena3ODfNVq", name: "Sparse gradients", parentId: "2JEnQqyt61em" },
  { id: "zJEnxT6H4A6~", name: "Reason 2", parentId: "2JEnQqyt61em" },
  
  { id: "N.EnqOhNgBIH", name: "Mitigating overfitting", parentId: "zJEnxT6H4A6~" },
  
  { id: "0MEn0_ZC9ngd", name: "Benefits", parentId: "LaZmI--VUCjE" },
  { id: "vmFnbziFCGHb", name: "A LOT of parameters", parentId: "LaZmI--VUCjE" },
  
  { id: "gmFnghyH.zpD", name: "AdaGrad benefits", parentId: "0MEn0_ZC9ngd" },
  { id: "nNEn46C.5SKK", name: "RMSProp benefits", parentId: "0MEn0_ZC9ngd" },
  { id: "cNEnEC0uPWoJ", name: "Momentum benefits", parentId: "0MEn0_ZC9ngd" },
  
  { id: "gMEnphVIJM71", name: "Introduces weight decay", parentId: "vo8mF9JfowCG" },
  
  // Regularization
  { id: "n5YmXLaYY8WP", name: "Regularization Techniques", parentId: "yq1G2-Rxt0Qn" },
  { id: "A7Dn_kfy-C5D", name: "Weight Decay", parentId: "n5YmXLaYY8WP" },
  { id: "cbZmF-G6T.7O", name: "Dropout", parentId: "n5YmXLaYY8WP" },
  { id: "cC8mD-mO99Da", name: "Gradient Clipping", parentId: "n5YmXLaYY8WP" },
  { id: "bD8mHInvv0Ae", name: "Data augmentation", parentId: "n5YmXLaYY8WP" },
  
  { id: "XSGnYkXSWBSB", name: "Penalizes large weights", parentId: "A7Dn_kfy-C5D" },
  { id: "yPGnHmvaqlpS", name: "Additional loss term", parentId: "A7Dn_kfy-C5D" },
  { id: "_aZmFgX2MXfp", name: "L2", parentId: "n5YmXLaYY8WP" },
  { id: "ZaZm8Y-hJr5A", name: "L1", parentId: "n5YmXLaYY8WP" },
  
  { id: "wZ9mhQ4.H6c7", name: "Considers all features", parentId: "_aZmFgX2MXfp" },
  { id: "On8mlwAMGt44", name: "Weight decay", parentId: "_aZmFgX2MXfp" },
  
  { id: "mZ9mP~kbQAiH", name: "Nonzero coefficients", parentId: "_aZmFgX2MXfp" },
  { id: "nY9m6PCfk3C3", name: "Model ignores some features", parentId: "ZaZm8Y-hJr5A" },
  { id: "uY9myH-a0DXk", name: "Beneficial for feature selection", parentId: "ZaZm8Y-hJr5A" },
  
  { id: "sq8m0DJh_ihI", name: "Trains ensemble with shared weights", parentId: "cbZmF-G6T.7O" },
  
  { id: "AC8mRgb5U5_5", name: "Exploding gradients", parentId: "cC8mD-mO99Da" },
  
  // Training Fundamentals
  { id: "tODnB5NE1M9g", name: "Weight & Bias Updates", parentId: "UVCndueRufra" },
  { id: "rWCnQtvs6qhX", name: "Empirical Risk Minimization", parentId: "UVCndueRufra" },
  { id: "V7YmAe59fQ2u", name: "Maximum Likelihood Estimation", parentId: "UVCndueRufra" },
  { id: "0~YmvJJkj~MW", name: "Common Problems", parentId: "UVCndueRufra" },
  { id: "A.Dn8Lyoe-VV", name: "Degradation Problem", parentId: "UVCndueRufra" },
  
  { id: ".RDnE3Y-jVak", name: "Gradient Descent Update Rule", parentId: "tODnB5NE1M9g" },
  { id: "KRDnD7CM9LbW", name: "Calculate gradients", parentId: "tODnB5NE1M9g" },
  { id: "6YDnVei_SEAj", name: "Iterative update", parentId: "tODnB5NE1M9g" },
  
  { id: "ZQCnuOMnro_G", name: "Used for inference", parentId: "V7YmAe59fQ2u" },
  { id: "zjgnJ~ZiSGQB", name: "Find theta", parentId: "V7YmAe59fQ2u" },
  
  { id: "0jgnhxcVENU8", name: "Likelihood p(X|theta)", parentId: "zjgnJ~ZiSGQB" },
  { id: "2lgnjSmuoTsX", name: "Function of theta", parentId: "0jgnhxcVENU8" },
  
  { id: "0dZmIXS9MfIk", name: "Vanishing gradient", parentId: "0~YmvJJkj~MW" },
  { id: "jdZmx4n2rhnG", name: "Only converges on convex", parentId: "0~YmvJJkj~MW" },
  
  { id: "ajEnDlQahS8i", name: "Why: Vanishing/exploding", parentId: "A.Dn8Lyoe-VV" },
  { id: "IiEn5cDa3_jj", name: "Performance degrades with depth", parentId: "A.Dn8Lyoe-VV" },
  
  // Advanced Topics
  { id: "g8DnDxNenAyY", name: "Feature engineering", parentId: "57DnUiL_dIpt" },
  { id: "Q8DnWJ.103aX", name: "Scaling Laws", parentId: "57DnUiL_dIpt" },
  { id: "YfEn2HJh8Q2n", name: "Other models", parentId: "57DnUiL_dIpt" },
  { id: "R2EngmB-acCf", name: "Word Embeddings", parentId: "57DnUiL_dIpt" },
  
  { id: "v7Hndu3Fvzuq", name: "Word2Vec", parentId: "R2EngmB-acCf" },
  
  { id: "6fEnrMzvdcru", name: "Image captioning (transformer)", parentId: "YfEn2HJh8Q2n" },
  
  { id: "dYDnWtcE5ZyC", name: "Feature engineering", parentId: ".WDn6_vJi67r" },
  { id: "CXDn6x_EDaVx", name: "Kernel SVMs", parentId: ".WDn6_vJi67r" },
  { id: "TXDn3NN0YcVZ", name: "Random forests", parentId: ".WDn6_vJi67r" },
  
  // How perceptron works
  { id: "F9CnmjPxgtnH", name: "Take binary inputs", parentId: "h9CnbQBtv9.d" },
  { id: "h-CnMB8HQy2G", name: "Sum up w1x1 + w2x2 + b", parentId: "h9CnbQBtv9.d" },
  { id: "T-CnnU9dL76g", name: "Apply activation function", parentId: "h9CnbQBtv9.d" },
  { id: "e_CnzwNJK27b", name: "Output", parentId: "h9CnbQBtv9.d" },
  
  // Backprop
  { id: "zjDnVgHMaxQH", name: "Hadamard Product", parentId: "G_Ymzn83_uSA" },
];
