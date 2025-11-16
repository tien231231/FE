
    const API_URL = "http://localhost:3000/users";
    const tbody = document.querySelector("#employeeTable tbody");
    const modal = document.getElementById("userModal");
    const modalTitle = document.getElementById("modalTitle");
    const saveBtn = document.getElementById("saveBtn");
    const openAddModal = document.getElementById("openAddModal");
    const closeModal = document.getElementById("closeModal");
    let currentPage=1;
const itemsPerPage = 5; // Số dòng mỗi trang
let allUsers = [];      // Lưu toàn bộ user để phân trang
    
    async function fetchUsers() {
  const res = await fetch(API_URL);
  allUsers = await res.json();

  const totalPages = Math.ceil(allUsers.length / itemsPerPage);

  // Nếu đang ở trang cuối mà xóa hết → lùi lại 1 trang
  if (currentPage > totalPages) {
    currentPage = totalPages > 0 ? totalPages : 1;
  }

  renderPagination();
}
    function renderPagination() {
  const totalPages = Math.ceil(allUsers.length / itemsPerPage);

  // Chặn vượt trang
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  // Tính index
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // Lấy data cho trang hiện tại
  const pageData = allUsers.slice(start, end);

  // Vẽ bảng như cũ
  renderTable(pageData);

  // Hiển thị text trang
  document.getElementById("pageInfo").textContent =
    `Trang ${currentPage} / ${totalPages}`;

  // Enable/disable nút
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}
    function renderTable(data) {
      tbody.innerHTML = "";
      data.forEach(emp => {
        const bonus = Number(emp.bonus.replace(/[^0-9]/g, "")) / 100;
        const deduction = Number(emp.deduction.replace(/[^0-9]/g, "")) / 100;
        const total = emp.salary * (1 + bonus) * (1 - deduction);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.salary}</td>
          <td>${emp.bonus}</td>
          <td>${emp.deduction}</td>
          <td>${total.toFixed(0)}</td>
          <td>
            <button class="edit-btn" onclick="editUser('${emp.id}')">Sửa</button>
            <button class="delete-btn" onclick="deleteUser('${emp.id}')">Xóa</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Mở modal thêm
    openAddModal.onclick = () => {
  modalTitle.textContent = "Thêm nhân viên";
  modal.style.display = "flex";
  clearForm(); 

  saveBtn.onclick = () => {
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const salary = document.getElementById("salary").value.trim();
    const bonus = document.getElementById("bonus").value.trim();
    const deduction = document.getElementById("deduction").value.trim();

    
    document.getElementById("errorName").textContent = "";
    document.getElementById("errorEmail").textContent = "";
    document.getElementById("errorSalary").textContent = "";
    document.getElementById("errorBonus").textContent = "";
    document.getElementById("errorDeduction").textContent = "";

    let valid = true;

    
    if (!name) {
      document.getElementById("errorName").textContent = "Vui lòng nhập tên nhân viên";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById("errorEmail").textContent = "Email không hợp lệ";
      valid = false;
    }

    if (!salary || isNaN(salary) || Number(salary) <= 0) {
      document.getElementById("errorSalary").textContent = "Lương phải là số lớn hơn 0";
      valid = false;
    }

    const percentRegex = /^\d+%$/;
    if (bonus && !percentRegex.test(bonus)) {
      document.getElementById("errorBonus").textContent = "Thưởng phải theo định dạng số% (vd: 20%)";
      valid = false;
    }

    if (deduction && !percentRegex.test(deduction)) {
      document.getElementById("errorDeduction").textContent = "Khấu trừ phải theo định dạng số% (vd: 10%)";
      valid = false;
    }

    
    if (!valid) return;

    addUser({
      name,
      email,
      salary: Number(salary),
      bonus,
      deduction
    });
  };
};

    // Đóng modal
    closeModal.onclick = () => modal.style.display = "none";

    // Lấy dữ liệu form
    function getFormData() {
      return {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        salary: Number(document.getElementById("salary").value),
        bonus: document.getElementById("bonus").value,
        deduction: document.getElementById("deduction").value
      };
    }

    // Xóa dữ liệu form
    function clearForm() {
      ["userId", "name", "email", "salary", "bonus", "deduction"].forEach(id => {
        document.getElementById(id).value = "";
      });
    }

    // Thêm nhân viên
    async function addUser() {
      const newUser = getFormData();
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        modal.style.display = "none";
        fetchUsers();
      }
    }

    // Xóa nhân viên
    function deleteUser(id) {
  deleteId = id;           // lưu ID tạm
  deleteModal.style.display = "flex";  // mở modal xác nhận
}

    // Sửa nhân viên
    async function editUser(id) {
      const res = await fetch(`${API_URL}/${id}`);
      const emp = await res.json();
      modalTitle.textContent = "Sửa nhân viên";
      modal.style.display = "flex";
      document.getElementById("userId").value = emp.id;
      document.getElementById("name").value = emp.name;
      document.getElementById("email").value = emp.email;
      document.getElementById("salary").value = emp.salary;
      document.getElementById("bonus").value = emp.bonus;
      document.getElementById("deduction").value = emp.deduction;
      saveBtn.onclick = () => updateUser(id);
    }

    // Cập nhật nhân viên
    async function updateUser(id) {
      const updatedUser = getFormData();
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
      });
      if (res.ok) {
        modal.style.display = "none";
        fetchUsers();
      }
    }

    fetchUsers();

    document.getElementById("prevPage").onclick = () => {
  currentPage--;
  renderPagination();
};

document.getElementById("nextPage").onclick = () => {
  currentPage++;
  renderPagination();
};

const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
let deleteId = null; // lưu ID nhân viên chuẩn bị xoá

confirmDelete.onclick = async () => {
  await fetch(`${API_URL}/${deleteId}`, { method: "DELETE" });
  deleteModal.style.display = "none";
  fetchUsers();
};

cancelDelete.onclick = () => {
  deleteModal.style.display = "none";
  deleteId = null;
};