import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


interface Cliente {
  id?: number;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  esFrecuente?: boolean;
  productosRegistrados?: number;
}

interface Producto {
  id?: number;
  codigo?: string;
  nombre: string;
  categoria: string;
  peso: number;
  alto?: number;
  largo?: number;
  ancho?: number;
  medidas?: string;
  puntoAcopio: string;
  destino: string;
  estado: string;
  fechaIngreso?: Date | string;
  guiaRemision?: File | string;
  empleado: string;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {
//apiUrl = 'http://localhost:3000';
  activeTab: string = 'clientes';
  
  private mockClientes: Cliente[] = [
    {
      id: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      esFrecuente: true,
      productosRegistrados: 3
    },
    {
      id: 2,
      nombres: 'María',
      apellidos: 'Gómez',
      tipoDocumento: 'RUC',
      numeroDocumento: '20123456789',
      esFrecuente: false,
      productosRegistrados: 0
    }
  ];

  // Datos mock para productos
  private mockProductos: Producto[] = [
    {
      id: 1,
      codigo: 'PRD-001',
      nombre: 'Dispositivo Médico X200',
      categoria: 'Equipo Médico',
      peso: 15.5,
      alto: 15,
      largo: 15,
      ancho: 15,
      medidas: '30x40x20 cm',
      puntoAcopio: "Lima",
      destino: 'Lima',
      estado: 'EN_ALMACEN',
      fechaIngreso: new Date,
      empleado: "Carlos"
    }
  ];
  // Variables para pestaña Clientes
  searchQuery: string = '';
  clientResults: Cliente[] = [];
  selectedClient: Cliente | null = null;
  currentClient: Cliente = this.createEmptyClient();
  isEditMode: boolean = false;
  searchPerformed: boolean = false;

  // Variables para pestaña Productos
  @ViewChild('productModal') productModal!: TemplateRef<any>;
  productos: Producto[] = [];
  currentProduct: Producto = this.createEmptyProduct();
  isEditingProduct: boolean = false;
  categorias = ['Electrónicos', 'Equipo Médico', 'Insumos', 'Materiales'];
  puntosAcopio = ['Almacén Central', 'Centro de Distribución Norte', 'Centro de Distribución Sur'];
  empleados = ['Juan Pérez', 'María Gómez', 'Carlos Sánchez'];
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.loadProducts();
    this.selectTab('cliente');
  }
  selectTab(tab: string): void {
    this.activeTab = tab;
  }
  // ========== MÉTODOS PARA CLIENTES ==========
  private createEmptyClient(): Cliente {
    return {
      nombres: '',
      apellidos: '',
      tipoDocumento: '',
      numeroDocumento: ''
    };
  }

  loadInitialData(): void {
    this.clientResults = this.mockClientes.filter(c => c.esFrecuente);
  }
  /*loadInitialData(): void {
    this.http.get<Cliente[]>('/api/clientes/frecuentes').subscribe({
      next: (data) => this.clientResults = data,
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }*/

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.clientResults = this.mockClientes.filter(c => 
      c.nombres.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      c.numeroDocumento.includes(this.searchQuery)
    );
    this.searchPerformed = true;
  }
  /*onSearch(): void {
    if (!this.searchQuery.trim()) return;
    
    this.http.get<Cliente[]>(`/api/clientes/buscar?q=${this.searchQuery}`).subscribe({
      next: (data) => {
        this.clientResults = data;
        this.searchPerformed = true;
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.clientResults = [];
      }
    });
  }*/

  onSelectClient(client: Cliente): void {
    this.selectedClient = client;
    this.currentClient = { ...client };
    this.isEditMode = true;
  }

  onSubmit(): void {
    if (this.isEditMode) {
      // Actualizar cliente existente
      const index = this.mockClientes.findIndex(c => c.id === this.currentClient.id);
      if (index !== -1) {
        this.mockClientes[index] = { ...this.currentClient };
      }
    } else {
      // Crear nuevo cliente
      const newId = Math.max(...this.mockClientes.map(c => c.id || 0)) + 1;
      this.mockClientes.push({ ...this.currentClient, id: newId });
    }
    
    this.resetForm();
    this.loadInitialData();
  }
  /*onSubmit(): void {
    const apiCall = this.isEditMode 
      ? this.http.put(`/api/clientes/${this.currentClient.id}`, this.currentClient)
      : this.http.post('/api/clientes', this.currentClient);

    apiCall.subscribe({
      next: () => {
        this.resetForm();
        this.onSearch();
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }*/

  onCancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.currentClient = this.createEmptyClient();
    this.isEditMode = false;
    this.selectedClient = null;
  }

  // ========== MÉTODOS PARA PRODUCTOS ==========
  private createEmptyProduct(): Producto {
    return {
      nombre: '',
      categoria: '',
      peso: 0,
      puntoAcopio: '',
      destino: '',
      estado: 'EN_ALMACEN',
      empleado: ''
    };
  }

  loadProducts(): void {
    // Implementación simple de paginación con datos mock
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.productos = this.mockProductos.slice(startIndex, endIndex);
    this.totalItems = this.mockProductos.length;
  }
  /*loadProducts(): void {
    const params = {
      page: this.currentPage.toString(),
      limit: this.itemsPerPage.toString()
    };

    this.http.get<any>('/api/productos', { params }).subscribe({
      next: (response) => {
        this.productos = response.data;
        this.totalItems = response.total;
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }*/

  openProductModal(producto?: Producto): void {
    this.isEditingProduct = !!producto;
    this.currentProduct = producto ? { ...producto } : this.createEmptyProduct();
    
    this.modalService.open(this.productModal, { 
      size: 'lg',
      backdrop: 'static'
    }).result.then(
      () => this.resetProductForm(),
      () => this.resetProductForm()
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.currentProduct.guiaRemision = file;
    }
  }

  saveProduct(): void {
    if (this.isEditingProduct) {
      // Actualizar producto existente
      const index = this.mockProductos.findIndex(p => p.id === this.currentProduct.id);
      if (index !== -1) {
        this.mockProductos[index] = { ...this.currentProduct };
      }
    } else {
      // Crear nuevo producto
      const newId = Math.max(...this.mockProductos.map(p => p.id || 0)) + 1;
      this.mockProductos.push({ 
        ...this.currentProduct, 
        id: newId,
        fechaIngreso: new Date()
      });
    }
    
    this.loadProducts();
    this.modalService.dismissAll();
  }
  /*saveProduct(): void {
    const formData = new FormData();
    Object.keys(this.currentProduct).forEach(key => {
      const value = this.currentProduct[key as keyof Producto];
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const apiCall = this.isEditingProduct
      ? this.http.put(`/api/productos/${this.currentProduct.id}`, formData)
      : this.http.post('/api/productos', formData);

    apiCall.subscribe({
      next: () => {
        this.loadProducts();
        this.modalService.dismissAll();
      },
      error: (err) => console.error('Error al guardar producto:', err)
    });
  }*/

  editProduct(producto: Producto): void {
    this.openProductModal(producto);
  }

  confirmDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.mockProductos = this.mockProductos.filter(p => p.id !== id);
      this.loadProducts();
    }
  }
  /*confirmDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.http.delete(`/api/productos/${id}`).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }*/

  viewDetails(producto: Producto): void {
    // Implementar según necesidades
    console.log('Detalles del producto:', producto);
  }

  getEstadoText(estado: string): string {
    const estados: { [key: string]: string } = {
      'EN_ALMACEN': 'En almacén',
      'EN_TRANSITO': 'En tránsito',
      'ENTREGADO': 'Entregado'
    };
    return estados[estado] || estado;
  }

  resetProductForm(): void {
    this.currentProduct = this.createEmptyProduct();
    this.isEditingProduct = false;
  }

  // Método para generar medidas automáticamente
  updateMedidas(): void {
    if (this.currentProduct.alto && this.currentProduct.largo && this.currentProduct.ancho) {
      this.currentProduct.medidas = 
        `${this.currentProduct.alto}x${this.currentProduct.largo}x${this.currentProduct.ancho} cm`;
    }
  }
}