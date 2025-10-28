// AI Providers Management
class AIProvidersManager {
    constructor() {
        this.providers = [];
        this.models = [];
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadProviders();
        this.loadAllModels();
    }

    initEventListeners() {
        // Add provider form submission
        const addProviderForm = document.getElementById('provider-form');
        if (addProviderForm) {
            addProviderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProvider();
            });
        }

        // Edit provider form submission
        const editProviderForm = document.getElementById('edit-provider-form');
        if (editProviderForm) {
            editProviderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProvider();
            });
        }

        // Add provider button
        const addProviderBtn = document.getElementById('add-provider-btn');
        if (addProviderBtn) {
            addProviderBtn.addEventListener('click', () => {
                this.showAddProviderModal();
            });
        }
    }

    async loadProviders() {
        try {
            const response = await fetch('/api/ai-providers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('pythagora-token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.providers = data.data.providers;
                this.renderProviders();
            } else {
                console.error('Failed to load providers');
            }
        } catch (error) {
            console.error('Error loading providers:', error);
        }
    }

    async loadAllModels() {
        try {
            const response = await fetch('/api/ai-providers/models/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('pythagora-token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.models = data.data.models;
                this.renderModels();
            } else {
                console.error('Failed to load models');
            }
        } catch (error) {
            console.error('Error loading models:', error);
        }
    }

    renderProviders() {
        const container = document.getElementById('providers-container');
        if (!container) return;

        if (this.providers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                    <h3>No AI Providers</h3>
                    <p>Add your first AI provider to get started</p>
                    <button class="btn btn-primary" onclick="aiProvidersManager.showAddProviderModal()">
                        Add Provider
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.providers.map(provider => `
            <div class="provider-card">
                <div class="provider-header">
                    <div class="provider-info">
                        <h3>${provider.displayName}</h3>
                        <p>${provider.name} • Priority ${provider.priority}</p>
                    </div>
                    <div class="provider-status">
                        <span class="status-dot ${provider.isActive ? 'active' : 'inactive'}"></span>
                        ${provider.isActive ? 'Active' : 'Inactive'}
                    </div>
                </div>
                
                <div class="provider-models">
                    <h4>Available Models (${provider.models.length})</h4>
                    <div class="models-list">
                        ${provider.models.map(model => `
                            <div class="model-item">
                                <span class="model-name">${model.name}</span>
                                <span class="model-category">${model.category}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="provider-usage">
                    <div class="usage-stat">
                        <span class="usage-label">Requests:</span>
                        <span class="usage-value">${provider.usage.totalRequests.toLocaleString()}</span>
                    </div>
                    <div class="usage-stat">
                        <span class="usage-label">Tokens:</span>
                        <span class="usage-value">${provider.usage.totalTokens.toLocaleString()}</span>
                    </div>
                    <div class="usage-stat">
                        <span class="usage-label">Cost:</span>
                        <span class="usage-value">$${provider.usage.totalCost.toFixed(2)}</span>
                    </div>
                </div>

                <div class="provider-actions">
                    <button class="btn btn-secondary" onclick="aiProvidersManager.editProvider('${provider.id}')">
                        Edit
                    </button>
                    <button class="btn btn-secondary" onclick="aiProvidersManager.testProvider('${provider.id}')">
                        Test
                    </button>
                    <button class="btn btn-danger" onclick="aiProvidersManager.deleteProvider('${provider.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderModels() {
        // This will be used by AI Studio to populate model selectors
        if (window.aiStudio && window.aiStudio.populateModelSelectors) {
            window.aiStudio.populateModelSelectors();
        }
    }

    showAddProviderModal() {
        const modal = document.getElementById('add-provider-modal');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal && overlay) {
            overlay.classList.add('active');
            modal.style.display = 'block';
        }
    }

    hideAddProviderModal() {
        const modal = document.getElementById('add-provider-modal');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal && overlay) {
            overlay.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    showEditProviderModal(provider) {
        const modal = document.getElementById('edit-provider-modal');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal && overlay) {
            // Populate form with provider data
            document.getElementById('edit-provider-id').value = provider.id;
            document.getElementById('edit-display-name').value = provider.displayName;
            document.getElementById('edit-base-url').value = provider.baseUrl || '';
            document.getElementById('edit-priority').value = provider.priority;
            
            overlay.classList.add('active');
            modal.style.display = 'block';
        }
    }

    hideEditProviderModal() {
        const modal = document.getElementById('edit-provider-modal');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal && overlay) {
            overlay.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    async addProvider() {
        const form = document.getElementById('provider-form');
        const formData = new FormData(form);
        
        const providerData = {
            name: formData.get('provider-type'),
            displayName: formData.get('display-name'),
            apiKey: formData.get('api-key'),
            baseUrl: formData.get('base-url') || undefined,
            priority: parseInt(formData.get('priority'))
        };

        try {
            const response = await fetch('/api/ai-providers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('pythagora-token')}`
                },
                body: JSON.stringify(providerData)
            });

            if (response.ok) {
                const data = await response.json();
                this.providers.push(data.data.provider);
                this.renderProviders();
                this.hideAddProviderModal();
                form.reset();
                this.showNotification('Provider added successfully!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Failed to add provider', 'error');
            }
        } catch (error) {
            console.error('Add provider error:', error);
            this.showNotification('Failed to add provider', 'error');
        }
    }

    async updateProvider() {
        const form = document.getElementById('edit-provider-form');
        const formData = new FormData(form);
        const providerId = formData.get('provider-id');
        
        const updateData = {
            displayName: formData.get('display-name'),
            baseUrl: formData.get('base-url') || undefined,
            priority: parseInt(formData.get('priority'))
        };

        // Only include API key if provided
        if (formData.get('api-key')) {
            updateData.apiKey = formData.get('api-key');
        }

        try {
            const response = await fetch(`/api/ai-providers/${providerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('pythagora-token')}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const data = await response.json();
                const index = this.providers.findIndex(p => p.id === providerId);
                if (index !== -1) {
                    this.providers[index] = data.data.provider;
                }
                this.renderProviders();
                this.hideEditProviderModal();
                this.showNotification('Provider updated successfully!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Failed to update provider', 'error');
            }
        } catch (error) {
            console.error('Update provider error:', error);
            this.showNotification('Failed to update provider', 'error');
        }
    }

    async deleteProvider(providerId) {
        if (!confirm('Are you sure you want to delete this provider?')) {
            return;
        }

        try {
            const response = await fetch(`/api/ai-providers/${providerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('pythagora-token')}`
                }
            });

            if (response.ok) {
                this.providers = this.providers.filter(p => p.id !== providerId);
                this.renderProviders();
                this.showNotification('Provider deleted successfully!', 'success');
            } else {
                this.showNotification('Failed to delete provider', 'error');
            }
        } catch (error) {
            console.error('Delete provider error:', error);
            this.showNotification('Failed to delete provider', 'error');
        }
    }

    async testProvider(providerId) {
        try {
            const response = await fetch(`/api/ai-providers/${providerId}/test`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('pythagora-token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.showNotification(`Provider test successful! Response time: ${data.data.responseTime}ms`, 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Provider test failed', 'error');
            }
        } catch (error) {
            console.error('Test provider error:', error);
            this.showNotification('Provider test failed', 'error');
        }
    }

    editProvider(providerId) {
        const provider = this.providers.find(p => p.id === providerId);
        if (provider) {
            this.showEditProviderModal(provider);
        }
    }

    showNotification(message, type = 'info') {
        // Use the app's notification system if available
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize AI Providers Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiProvidersManager = new AIProvidersManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIProvidersManager;
}