import os
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

# 1. Custom Dataset Scaffolding for Injury Images
class InjuryDataset(Dataset):
    """
    Custom Dataset class for loading clinical injury images (Kaggle/Roboflow custom augmentations).
    Classifies swelling severity (4 classes: 0=None, 1=Mild, 2=Moderate, 3=Severe).
    """
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        
        # Load image safely in RGB
        try:
            image = Image.open(img_path).convert('RGB')
        except Exception as e:
            # Fallback to dummy tensor image if path is invalid during mock validations
            image = Image.new('RGB', (224, 224), color='red')

        if self.transform:
            image = self.transform(image)

        return image, torch.tensor(label, dtype=torch.long)

# 2. Complete Model Training Pipeline
def train_injury_model():
    print("[INFO] Starting InjuryIQ AI PyTorch Model Training Pipeline...")
    
    # Check GPU availability (CUDA / MPS / CPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Using compute device: {device}")

    # Standard Healthcare Image Augmentations & Normalizations
    transform_train = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    transform_val = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Mock dataset loaders for college presentation demonstrations
    # In actual deployment, these should point to folders of classified joint photos
    dummy_image_paths = ["mock_img_1.jpg", "mock_img_2.jpg", "mock_img_3.jpg", "mock_img_4.jpg"]
    dummy_labels = [0, 1, 2, 3] # Representing None, Mild, Moderate, Severe swelling

    train_dataset = InjuryDataset(dummy_image_paths, dummy_labels, transform=transform_train)
    train_loader = DataLoader(train_dataset, batch_size=2, shuffle=True)

    # Use Transfer Learning with pre-trained MobileNetV3 (Highly lightweight for mobile API servers)
    print("[INFO] Loading pre-trained MobileNetV3 backbone model layers...")
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)

    # Freeze pre-trained feature extractors to retain early weight patterns
    for param in model.parameters():
        param.requires_grad = False

    # Replace classifier head for 4-class Swelling Classification
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Linear(in_features, 128),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(128, 4) # 4 output classes: None, Mild, Moderate, Severe
    )
    
    model = model.to(device)

    # Optimizer, Loss and Cosine Annealing Learning Rate Scheduler
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=1e-3)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

    # Start Training loop
    epochs = 3
    print(f"[INFO] Initiating training loop for {epochs} epochs...")
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        start_time = time.time()
        
        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

        scheduler.step()
        
        epoch_loss = running_loss / total
        epoch_acc = (correct / total) * 100
        epoch_time = time.time() - start_time
        
        print(f"Epoch [{epoch+1}/{epochs}] - Loss: {epoch_loss:.4f} - Acc: {epoch_acc:.2f}% - Time: {epoch_time:.2f}s")

    # Save trained weights safely to pth file
    model_save_path = "injuryiq_model.pth"
    torch.save(model.state_dict(), model_save_path)
    print(f"[SUCCESS] PyTorch model state dict successfully saved to: {model_save_path}")

if __name__ == "__main__":
    # Create mock images if they don't exist to prevent IOErrors in dummy runs
    for i in range(1, 5):
        if not os.path.exists(f"mock_img_{i}.jpg"):
            img = Image.new('RGB', (224, 224), color=(100 + i*30, 50, 50))
            img.save(f"mock_img_{i}.jpg")
            
    train_injury_model()
