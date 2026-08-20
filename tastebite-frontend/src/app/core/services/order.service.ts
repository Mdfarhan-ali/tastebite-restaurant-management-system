import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/orders`;

  createOrder(
    totalAmount: number,
    deliveryAddress: string
  ): Observable<Order> {

    return this.http.post<Order>(
      this.apiUrl,
      {
        totalAmount,
        deliveryAddress
      }
    );
  }

  getMyOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(
      this.apiUrl
    );
  }

  getOrder(id: number): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${id}`
    );
  }

  getAllOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(
      `${this.apiUrl}/admin`
    );
  }

  updateOrderStatus(
    id: number,
    status: string
  ): Observable<Order> {

    return this.http.patch<Order>(
      `${this.apiUrl}/admin/${id}/status`,
      {},
      {
        params: {
          status
        }
      }
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}