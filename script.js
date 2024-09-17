document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const orderTable = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
    const orders = [];
    let editingIndex = -1; // Chỉ số của vận đơn đang được chỉnh sửa

    const BASE_URL = 'https://admin-server-logistic.vercel.app'; // URL của server backend

    // Tạo một NumberFormat để định dạng tiền VNĐ và CNY
    const currencyFormatterVND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    const currencyFormatterCNY = new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY'
    });

    const exchangeRate = 0.00028; // Tỷ giá chuyển đổi từ VNĐ sang CNY

    async function fetchOrders() {
        try {
            const response = await fetch(`${BASE_URL}/orders`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            orders.length = 0; // Clear the existing orders array
            orders.push(...data); // Add fetched orders to the array
            renderTable();
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    async function postOrder(order) {
        try {
            const response = await fetch(`${BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newOrder = await response.json();
            orders.push(newOrder);
            renderTable();
        } catch (error) {
            console.error('Error posting order:', error);
        }
    }

    async function updateOrder(trackingNumber, updatedOrder) {
        try {
            const response = await fetch(`${BASE_URL}/orders/${trackingNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedOrder)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedOrderFromServer = await response.json();
            const index = orders.findIndex(order => order.trackingNumber === trackingNumber);
            if (index > -1) {
                orders[index] = updatedOrderFromServer;
                renderTable();
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }

    async function deleteOrder(trackingNumber) {
        try {
            const response = await fetch(`${BASE_URL}/orders/${trackingNumber}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const index = orders.findIndex(order => order.trackingNumber === trackingNumber);
            if (index > -1) {
                orders.splice(index, 1);
                renderTable();
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    }

    function renderTable() {
        orderTable.innerHTML = ''; // Xóa dữ liệu cũ trong bảng
        orders.forEach((order) => {
            const row = orderTable.insertRow();
            const cells = [
                order.trackingNumber,
                order.carrier,
                order.sendDate,
                order.deliveryDate,
                order.status,
                order.sender,
                order.receiver,
                order.item,
                `${order.weight} kg`,
                currencyFormatterVND.format(parseFloat(order.cost)),
                currencyFormatterCNY.format(parseFloat(order.costCNY))
            ];

            cells.forEach(cellData => {
                const cell = row.insertCell();
                cell.textContent = cellData;
            });

            // Thêm cột hành động
            const actionCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.textContent = 'Sửa';
            editButton.className = 'edit';
            editButton.addEventListener('click', () => {
                const index = orders.findIndex(o => o.trackingNumber === order.trackingNumber);
                fillFormForEditing(index);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Xóa';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', () => {
                deleteOrder(order.trackingNumber);
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
        });
    }


    function fillFormForEditing(index) {
        const order = orders[index];
        document.getElementById('trackingNumber').value = order.trackingNumber;
        document.getElementById('carrier').value = order.carrier;
        document.getElementById('sendDate').value = order.sendDate;
        document.getElementById('deliveryDate').value = order.deliveryDate;
        document.getElementById('status').value = order.status;
        document.getElementById('sender').value = order.sender;
        document.getElementById('receiver').value = order.receiver;
        document.getElementById('item').value = order.item;
        document.getElementById('weight').value = order.weight;
        document.getElementById('cost').value = order.cost;
        editingIndex = index;
    }

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newOrder = {
            trackingNumber: document.getElementById('trackingNumber').value,
            carrier: document.getElementById('carrier').value,
            sendDate: document.getElementById('sendDate').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            status: document.getElementById('status').value,
            sender: document.getElementById('sender').value,
            receiver: document.getElementById('receiver').value,
            item: document.getElementById('item').value,
            weight: document.getElementById('weight').value,
            cost: document.getElementById('cost').value,
            costCNY: (parseFloat(document.getElementById('cost').value) * exchangeRate).toFixed(2) // Tính chi phí CNY
        };
    
        const existingOrder = orders.find(order => order.trackingNumber === newOrder.trackingNumber);
    
        if (existingOrder) {
            // Nếu mã vận đơn đã tồn tại, thực hiện cập nhật
            await updateOrder(newOrder.trackingNumber, newOrder);
        } else {
            // Nếu mã vận đơn không tồn tại, thực hiện thêm mới
            await postOrder(newOrder);
        }
        
        renderTable();
        orderForm.reset();
    });
    

    fetchOrders(); // Lấy dữ liệu đơn hàng khi trang được tải
});
