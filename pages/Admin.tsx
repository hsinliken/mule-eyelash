import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useBookings } from '../contexts/BookingContext';
import { useOrders } from '../contexts/OrderContext';
import { useStylists } from '../contexts/StylistContext';
import { usePromotions } from '../contexts/PromotionContext';
import { useShop } from '../contexts/ShopContext';
import { Product, Stylist, Promotion, Order, OrderStatus } from '../types';
import { SERVICES } from '../constants';
import { Plus, Edit2, Trash2, X, Save, Package, Truck, Check, User, Calendar, Clock, ImageIcon, Tag, FileText, Download, MapPin, CreditCard, DollarSign, Filter, RefreshCcw, Settings as SettingsIcon, BookOpen, MessageCircle } from 'lucide-react';
import { DEV_SPEC_MD, USER_MANUAL_MD } from '../docs';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { appointments, updateAppointmentStatus } = useBookings();
  const { orders, updateOrder } = useOrders();
  const { stylists, addStylist, updateStylist, deleteStylist } = useStylists();
  const { promotions, addPromotion, updatePromotion, deletePromotion } = usePromotions();
  const { settings, updateSettings } = useShop();

  const [activeTab, setActiveTab] = useState<'bookings' | 'stylists' | 'products' | 'orders' | 'promotions' | 'docs' | 'settings'>('bookings');

  // --- PRODUCT FORM STATE ---
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const initialProductForm = { name: '', price: 0, description: '', image: 'https://picsum.photos/id/21/500/500', inStock: true };
  const [productForm, setProductForm] = useState(initialProductForm);

  // --- STYLIST FORM STATE ---
  const [editingStylistId, setEditingStylistId] = useState<string | null>(null);
  const [isAddingStylist, setIsAddingStylist] = useState(false);
  const initialStylistForm: Omit<Stylist, 'id'> = {
    name: '',
    role: '',
    image: 'https://picsum.photos/id/65/200/200',
    rating: 5.0,
    specialties: [],
    workDays: [1, 2, 3, 4, 5], // Default Mon-Fri
    workHours: { start: '10:00', end: '19:00' }
  };
  const [stylistForm, setStylistForm] = useState(initialStylistForm);

  // --- PROMOTION FORM STATE ---
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const initialPromoForm: Omit<Promotion, 'id'> = {
    title: '',
    description: '',
    image: 'https://picsum.photos/id/431/800/450',
    label: '當季特惠',
    active: true
  };
  const [promoForm, setPromoForm] = useState(initialPromoForm);

  // --- ORDER EDIT STATE ---
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState<Order | null>(null);

  // --- ORDER FILTER STATE ---
  const [orderStartDate, setOrderStartDate] = useState('');
  const [orderEndDate, setOrderEndDate] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<OrderStatus | 'all'>('all');

  // --- SETTINGS FORM STATE ---
  const [settingsForm, setSettingsForm] = useState(settings);

  // Helper to find service names
  const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.title || '未知服務';
  const getStylistName = (id: string) => stylists.find(s => s.id === id)?.name || '未知美睫師';

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return '已確認';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      case 'pending': return '待處理';
      case 'paid': return '已付款';
      case 'shipped': return '已出貨';
      default: return status;
    }
  }

  // --- PRODUCT HANDLERS ---
  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({ ...product });
    setIsAddingProduct(false);
  };
  const handleSaveProduct = () => {
    if (isAddingProduct) addProduct(productForm);
    else if (editingProductId) updateProduct(editingProductId, productForm);
    setEditingProductId(null); setIsAddingProduct(false); setProductForm(initialProductForm);
  };
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('確定要刪除此商品嗎？')) deleteProduct(id);
  };

  // --- STYLIST HANDLERS ---
  const handleEditStylist = (stylist: Stylist) => {
    setEditingStylistId(stylist.id);
    setStylistForm({ ...stylist });
    setIsAddingStylist(false);
  };
  const handleSaveStylist = () => {
    if (isAddingStylist) addStylist(stylistForm);
    else if (editingStylistId) updateStylist(editingStylistId, stylistForm);
    setEditingStylistId(null); setIsAddingStylist(false); setStylistForm(initialStylistForm);
  };
  const handleDeleteStylist = (id: string) => {
    if (window.confirm('確定要刪除此美容師嗎？')) deleteStylist(id);
  };
  const toggleSpecialty = (type: 'Lash' | 'Brow' | 'Lip' | 'Care') => {
    setStylistForm(prev => {
      const exists = prev.specialties.includes(type);
      return {
        ...prev,
        specialties: exists ? prev.specialties.filter(s => s !== type) : [...prev.specialties, type]
      };
    });
  };
  const toggleWorkDay = (dayIndex: number) => {
    setStylistForm(prev => {
      const exists = prev.workDays.includes(dayIndex);
      return {
        ...prev,
        workDays: exists ? prev.workDays.filter(d => d !== dayIndex).sort() : [...prev.workDays, dayIndex].sort()
      };
    });
  };

  // --- PROMOTION HANDLERS ---
  const handleEditPromo = (promo: Promotion) => {
    setEditingPromoId(promo.id);
    setPromoForm({ ...promo });
    setIsAddingPromo(false);
  };
  const handleSavePromo = () => {
    if (isAddingPromo) addPromotion(promoForm);
    else if (editingPromoId) updatePromotion(editingPromoId, promoForm);
    setEditingPromoId(null); setIsAddingPromo(false); setPromoForm(initialPromoForm);
  };
  const handleDeletePromo = (id: string) => {
    if (window.confirm('確定要刪除此活動嗎？')) deletePromotion(id);
  };

  // --- ORDER HANDLERS ---
  const handleEditOrder = (order: Order) => {
    setEditingOrderId(order.id);
    // Deep copy to ensure we don't mutate state directly before saving
    setOrderForm(JSON.parse(JSON.stringify(order)));
  };
  const handleSaveOrder = () => {
    if (editingOrderId && orderForm) {
      updateOrder(editingOrderId, orderForm);
      setEditingOrderId(null);
      setOrderForm(null);
    }
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = () => {
    updateSettings(settingsForm);
    alert('設定已儲存！部分設定（如 LIFF ID）可能需要重新整理網頁才會生效。');
  };

  // Filter Orders Logic
  const filteredOrders = orders.filter(order => {
    const orderTime = new Date(order.createdAt).getTime();
    const start = orderStartDate ? new Date(orderStartDate).setHours(0, 0, 0, 0) : 0;
    const end = orderEndDate ? new Date(orderEndDate).setHours(23, 59, 59, 999) : Infinity;

    const isStatusMatch = orderFilterStatus === 'all' || order.status === orderFilterStatus;
    const isDateMatch = orderTime >= start && orderTime <= end;

    return isStatusMatch && isDateMatch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // --- DOC DOWNLOAD HANDLER ---
  const handleDownloadDoc = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tab List - Docs moved to end and renamed to Manuals (手冊)
  const TABS = [
    { id: 'bookings', label: '預約' },
    { id: 'orders', label: '訂單' },
    { id: 'stylists', label: '美容師' },
    { id: 'products', label: '商品' },
    { id: 'promotions', label: '行銷' },
    { id: 'settings', label: '設定' },
    { id: 'docs', label: '手冊' },
  ];

  return (
    <div className="pb-24 min-h-screen bg-brand-50/30">
      {/* Sticky Container for Header and Tabs - Increased Z-index */}
      <div className="sticky top-0 z-40 w-full shadow-md bg-brand-50">
        <div className="bg-brand-900 text-white p-6 flex justify-between items-center relative z-20">
          <div>
            <h1 className="text-xl font-light tracking-wide">商家管理後台</h1>
            <p className="text-xs text-brand-300 mt-1">管理庫存、人員、預約與行銷</p>
          </div>
          {/* Settings button in header is redundant if we have a tab, but keeping as quick access */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 bg-brand-800 rounded-lg text-brand-200 hover:text-white transition-colors"
          >
            <SettingsIcon size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-brand-50 p-4 pb-3 overflow-x-auto no-scrollbar border-b border-brand-100 relative z-10">
          <div className="bg-white rounded-xl p-1 flex shadow-sm border border-brand-100 min-w-max">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-100 text-brand-800' : 'text-brand-400'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {appointments.length === 0 && <div className="text-center text-brand-400 py-10">尚無預約。</div>}
            {appointments.map(apt => (
              <div key={apt.id} className="bg-white p-4 rounded-xl shadow-sm border border-brand-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                        'bg-brand-100 text-brand-700'
                      }`}>
                      {getStatusLabel(apt.status)}
                    </span>
                    <h3 className="font-medium text-brand-900">{getServiceName(apt.serviceId)}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-light text-brand-800">{apt.time}</div>
                    <div className="text-xs text-brand-500">{apt.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-600 mb-4 bg-brand-50 p-2 rounded-lg">
                  <span className="text-brand-400">美容師:</span>
                  <span className="font-medium">{getStylistName(apt.stylistId)}</span>
                </div>
                {apt.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateAppointmentStatus(apt.id, 'confirmed')} className="flex-1 bg-brand-800 text-white py-2 rounded-lg text-xs font-medium hover:bg-brand-900">接受預約</button>
                    <button onClick={() => { if (window.confirm('確定要婉拒此預約嗎？')) updateAppointmentStatus(apt.id, 'cancelled'); }} className="flex-1 bg-white text-red-400 border border-red-100 py-2 rounded-lg text-xs font-medium hover:bg-red-50">婉拒預約</button>
                  </div>
                )}
                {apt.status === 'confirmed' && (
                  <div className="flex gap-2">
                    <button onClick={() => { if (window.confirm('確認已完成服務？')) updateAppointmentStatus(apt.id, 'completed'); }} className="flex-1 bg-brand-50 text-brand-600 border border-brand-200 py-2 rounded-lg text-xs font-medium hover:bg-brand-100">完成服務</button>
                    <button onClick={() => { if (window.confirm('確認取消？')) updateAppointmentStatus(apt.id, 'cancelled'); }} className="flex-1 bg-white text-red-400 border border-red-100 py-2 rounded-lg text-xs font-medium hover:bg-red-50">取消</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in bg-white rounded-xl shadow-lg border border-brand-200 p-6">

            {/* Brand Settings */}
            <h2 className="text-lg font-medium text-brand-900 mb-6 flex items-center gap-2">
              <SettingsIcon size={20} className="text-brand-500" />
              商家品牌設定
            </h2>

            <div className="space-y-6 border-b border-brand-100 pb-8 mb-8">
              <div>
                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Logo 圖片連結</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settingsForm.logo}
                      onChange={e => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm"
                    />
                    <p className="text-[10px] text-brand-400 mt-1">請輸入 Logo 的圖片網址。</p>
                  </div>
                  <div className="w-20 h-20 bg-brand-50 border border-brand-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {settingsForm.logo ? (
                      <img src={settingsForm.logo} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-brand-300">無圖</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">商店名稱 (Line 1)</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    placeholder="例如: MULE EYELASH"
                    className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">副標題 (Line 2)</label>
                  <input
                    type="text"
                    value={settingsForm.subtitle}
                    onChange={e => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                    placeholder="例如: STUDIO"
                    className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* LINE Settings */}
            <h2 className="text-lg font-medium text-brand-900 mb-6 flex items-center gap-2">
              <MessageCircle size={20} className="text-brand-500" />
              LINE 整合設定
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">商家 LINE ID 或 加好友連結</label>
                <input
                  type="text"
                  value={settingsForm.lineId}
                  onChange={e => setSettingsForm({ ...settingsForm, lineId: e.target.value })}
                  placeholder="例如: @mule_eyelash 或 https://lin.ee/..."
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm"
                />
                <p className="text-[10px] text-brand-400 mt-1">用於「線上諮詢」按鈕。可填 ID (需含 @) 或完整的加好友網址。</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">LIFF ID (LINE Login)</label>
                <input
                  type="text"
                  value={settingsForm.liffId}
                  onChange={e => setSettingsForm({ ...settingsForm, liffId: e.target.value })}
                  placeholder="例如: 1657xxxxxx-xxxxxx"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm"
                />
                <p className="text-[10px] text-brand-400 mt-1">用於系統登入。更改後需重新整理頁面。</p>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full bg-brand-800 text-white py-3.5 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-brand-200 mt-8"
            >
              <Save size={18} /> 儲存所有設定
            </button>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {editingOrderId && orderForm ? (
              // ORDER EDIT FORM
              <div className="bg-white rounded-xl shadow-lg border border-brand-200 p-5 mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b border-brand-100 pb-2">
                  <h3 className="font-medium text-brand-900">編輯訂單 #{orderForm.id.slice(-6)}</h3>
                  <button onClick={() => { setEditingOrderId(null); setOrderForm(null); }} className="text-brand-400"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="bg-brand-50/50 p-3 rounded-lg border border-brand-100">
                    <h4 className="text-xs font-bold text-brand-500 uppercase mb-2 flex items-center gap-1"><User size={12} /> 顧客資訊</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-brand-400 block mb-1">姓名</label>
                        <input
                          type="text"
                          value={orderForm.customer.name}
                          onChange={e => setOrderForm({ ...orderForm, customer: { ...orderForm.customer, name: e.target.value } })}
                          className="w-full bg-white border border-brand-200 rounded p-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-brand-400 block mb-1">電話</label>
                        <input
                          type="text"
                          value={orderForm.customer.phone}
                          onChange={e => setOrderForm({ ...orderForm, customer: { ...orderForm.customer, phone: e.target.value } })}
                          className="w-full bg-white border border-brand-200 rounded p-1.5 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-brand-50/50 p-3 rounded-lg border border-brand-100">
                    <h4 className="text-xs font-bold text-brand-500 uppercase mb-2 flex items-center gap-1"><CreditCard size={12} /> 付款狀態</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-800">{orderForm.payment.method === 'credit_card' ? '信用卡' : orderForm.payment.method === 'line_pay' ? 'LINE Pay' : '轉帳'}</span>
                      <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-brand-200">
                        <input
                          type="checkbox"
                          checked={orderForm.payment.isPaid}
                          onChange={e => setOrderForm({ ...orderForm, payment: { ...orderForm.payment, isPaid: e.target.checked } })}
                          className="accent-brand-600 w-4 h-4"
                        />
                        <span className={`text-sm font-medium ${orderForm.payment.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                          {orderForm.payment.isPaid ? '已付款' : '未付款'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-brand-50/50 p-3 rounded-lg border border-brand-100">
                    <h4 className="text-xs font-bold text-brand-500 uppercase mb-2 flex items-center gap-1"><Truck size={12} /> 配送與物流</h4>

                    <div className="mb-3">
                      <label className="text-[10px] text-brand-400 block mb-1">訂單狀態</label>
                      <select
                        value={orderForm.status}
                        onChange={e => setOrderForm({ ...orderForm, status: e.target.value as OrderStatus })}
                        className="w-full bg-white border border-brand-200 rounded p-2 text-sm text-brand-800"
                      >
                        <option value="pending">待處理 (Pending)</option>
                        <option value="paid">已付款 (Paid)</option>
                        <option value="shipped">已出貨 (Shipped)</option>
                        <option value="completed">已完成 (Completed)</option>
                        <option value="cancelled">已取消 (Cancelled)</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="text-[10px] text-brand-400 block mb-1">物流單號</label>
                      <input
                        type="text"
                        value={orderForm.delivery.trackingNumber || ''}
                        onChange={e => setOrderForm({ ...orderForm, delivery: { ...orderForm.delivery, trackingNumber: e.target.value } })}
                        className="w-full bg-white border border-brand-200 rounded p-1.5 text-sm"
                        placeholder="尚未產生單號"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-brand-400 block mb-1">
                        {orderForm.delivery.method === 'home_delivery' ? '收件地址' : '取件門市'}
                      </label>
                      <textarea
                        rows={2}
                        value={orderForm.delivery.address}
                        onChange={e => setOrderForm({ ...orderForm, delivery: { ...orderForm.delivery, address: e.target.value } })}
                        className="w-full bg-white border border-brand-200 rounded p-1.5 text-sm"
                      />
                    </div>
                  </div>

                  <button onClick={handleSaveOrder} className="w-full bg-brand-800 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-brand-200 mt-2">
                    <Save size={18} /> 儲存訂單變更
                  </button>
                </div>
              </div>
            ) : (
              // ORDER LIST WITH FILTERS
              <>
                {/* --- FILTER SECTION --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-100 mb-4">
                  <div className="flex items-center gap-2 text-brand-800 font-medium mb-3 text-sm">
                    <Filter size={16} /> 訂單篩選
                  </div>

                  {/* Date Range */}
                  <div className="flex gap-2 items-center mb-4">
                    <div className="flex-1">
                      <label className="text-[10px] text-brand-400 block mb-1">開始日期</label>
                      <input
                        type="date"
                        value={orderStartDate}
                        onChange={(e) => setOrderStartDate(e.target.value)}
                        className="w-full bg-brand-50 border border-brand-200 rounded-lg p-2 text-xs text-brand-800"
                      />
                    </div>
                    <span className="text-brand-300 pt-4">-</span>
                    <div className="flex-1">
                      <label className="text-[10px] text-brand-400 block mb-1">結束日期</label>
                      <input
                        type="date"
                        value={orderEndDate}
                        onChange={(e) => setOrderEndDate(e.target.value)}
                        className="w-full bg-brand-50 border border-brand-200 rounded-lg p-2 text-xs text-brand-800"
                      />
                    </div>
                  </div>

                  {/* Status Tabs */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { val: 'all', label: '全部' },
                      { val: 'pending', label: '待處理' },
                      { val: 'paid', label: '已付款' },
                      { val: 'shipped', label: '已出貨' },
                      { val: 'completed', label: '已完成' },
                      { val: 'cancelled', label: '已取消' },
                    ].map(st => (
                      <button
                        key={st.val}
                        onClick={() => setOrderFilterStatus(st.val as any)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${orderFilterStatus === st.val
                          ? 'bg-brand-800 text-white border-brand-800'
                          : 'bg-white text-brand-500 border-brand-200 hover:bg-brand-50'
                          }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Reset Button (only show if active filters) */}
                  {(orderStartDate || orderEndDate || orderFilterStatus !== 'all') && (
                    <button
                      onClick={() => { setOrderStartDate(''); setOrderEndDate(''); setOrderFilterStatus('all'); }}
                      className="mt-3 flex items-center justify-center gap-1 text-xs text-brand-400 hover:text-brand-600 w-full py-1"
                    >
                      <RefreshCcw size={12} /> 清除篩選條件
                    </button>
                  )}
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center text-brand-400 py-10 bg-white rounded-xl border border-brand-100 border-dashed">
                    沒有符合條件的訂單。
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-brand-100 mb-3">
                      <div className="flex justify-between items-start border-b border-brand-50 pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-brand-900">{order.customer.name}</h3>
                            <span className="text-xs text-brand-400">#{order.id.slice(-6)}</span>
                          </div>
                          <p className="text-xs text-brand-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-500'
                            }`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${order.payment.isPaid ? 'border-green-200 text-green-600 bg-green-50' : 'border-red-200 text-red-500 bg-red-50'
                            }`}>
                            {order.payment.isPaid ? '已收款' : '未收款'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-brand-50 p-3 rounded-lg text-xs text-brand-600 mb-4 space-y-1">
                        <p><span className="font-bold">總計:</span> ${order.totalAmount}</p>
                        <p><span className="font-bold">配送:</span> {order.delivery.method === 'home_delivery' ? '宅配' : '超商'} ({order.delivery.address})</p>
                        {order.delivery.trackingNumber && <p><span className="font-bold">單號:</span> {order.delivery.trackingNumber}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditOrder(order)} className="flex-1 bg-white text-brand-600 border border-brand-200 py-2 rounded-lg text-xs font-medium flex justify-center items-center gap-1 hover:bg-brand-50">
                          <Edit2 size={14} /> 編輯詳情/出貨
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}

        {/* STYLISTS TAB */}
        {activeTab === 'stylists' && (
          <>
            {!isAddingStylist && !editingStylistId && (
              <button onClick={() => { setIsAddingStylist(true); setEditingStylistId(null); setStylistForm(initialStylistForm); }} className="w-full bg-white border-2 border-dashed border-brand-300 text-brand-500 rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-brand-50 transition-all mb-6">
                <Plus size={20} /> <span>新增美容師</span>
              </button>
            )}

            {(isAddingStylist || editingStylistId) && (
              <div className="bg-white rounded-xl shadow-lg border border-brand-200 p-5 mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b border-brand-100 pb-2">
                  <h3 className="font-medium text-brand-900">{isAddingStylist ? '新增美容師' : '編輯美容師'}</h3>
                  <button onClick={() => { setEditingStylistId(null); setIsAddingStylist(false); }} className="text-brand-400"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-500 uppercase mb-1">姓名</label>
                      <input type="text" value={stylistForm.name} onChange={e => setStylistForm({ ...stylistForm, name: e.target.value })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-500 uppercase mb-1">職稱</label>
                      <input type="text" value={stylistForm.role} onChange={e => setStylistForm({ ...stylistForm, role: e.target.value })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-1">照片連結</label>
                    <div className="flex gap-3 items-center">
                      <div className="relative flex-1">
                        <ImageIcon size={16} className="absolute left-3 top-2.5 text-brand-300" />
                        <input
                          type="text"
                          value={stylistForm.image}
                          onChange={e => setStylistForm({ ...stylistForm, image: e.target.value })}
                          className="w-full bg-brand-50 border border-brand-200 rounded-lg p-2 pl-9 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-brand-50 overflow-hidden border border-brand-200 shrink-0">
                        <img src={stylistForm.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">專長項目</label>
                    <div className="flex gap-2 flex-wrap">
                      {['Lash', 'Brow', 'Lip', 'Care'].map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleSpecialty(type as any)}
                          className={`px-3 py-1 rounded-full text-xs border ${stylistForm.specialties.includes(type as any) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-brand-400 border-brand-200'}`}
                        >
                          {type === 'Lash' ? '美睫' : type === 'Brow' ? '美眉' : type === 'Lip' ? '美唇' : '保養'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">可預約時段 (每日)</label>
                    <div className="flex items-center gap-2">
                      <input type="time" value={stylistForm.workHours.start} onChange={e => setStylistForm({ ...stylistForm, workHours: { ...stylistForm.workHours, start: e.target.value } })} className="bg-brand-50 border border-brand-200 rounded-lg p-2 text-sm" />
                      <span className="text-brand-400">至</span>
                      <input type="time" value={stylistForm.workHours.end} onChange={e => setStylistForm({ ...stylistForm, workHours: { ...stylistForm.workHours, end: e.target.value } })} className="bg-brand-50 border border-brand-200 rounded-lg p-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">每週工作日</label>
                    <div className="flex gap-1 flex-wrap">
                      {['日', '一', '二', '三', '四', '五', '六'].map((day, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleWorkDay(idx)}
                          className={`w-8 h-8 rounded-full text-xs font-medium border ${stylistForm.workDays.includes(idx) ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-brand-300 border-brand-100'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleSaveStylist} className="w-full bg-brand-800 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-brand-200 mt-2">
                    <Save size={18} /> 儲存設定
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {stylists.map(stylist => (
                <div key={stylist.id} className="bg-white p-3 rounded-xl border border-brand-100 shadow-sm flex items-start gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-brand-50">
                    <img src={stylist.image} alt={stylist.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-brand-900">{stylist.name}</h3>
                        <p className="text-xs text-brand-500">{stylist.role}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditStylist(stylist)} className="p-1.5 text-brand-500 hover:bg-brand-50 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteStylist(stylist.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 mb-2">
                      {stylist.specialties.map(s => (
                        <span key={s} className="text-[10px] bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded border border-brand-100">
                          {s === 'Lash' ? '美睫' : s === 'Brow' ? '美眉' : s === 'Lip' ? '美唇' : '保養'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {!isAddingProduct && !editingProductId && (
              <button onClick={() => { setIsAddingProduct(true); setEditingProductId(null); setProductForm(initialProductForm); }} className="w-full bg-white border-2 border-dashed border-brand-300 text-brand-500 rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-brand-50 transition-all mb-6">
                <Plus size={20} /> <span>新增商品</span>
              </button>
            )}
            {(isAddingProduct || editingProductId) && (
              <div className="bg-white rounded-xl shadow-lg border border-brand-200 p-5 mb-6">
                <div className="flex justify-between items-center mb-4 border-b border-brand-100 pb-2">
                  <h3 className="font-medium text-brand-900">{isAddingProduct ? '新增商品' : '編輯商品'}</h3>
                  <button onClick={() => { setEditingProductId(null); setIsAddingProduct(false); }} className="text-brand-400"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-1">商品名稱</label>
                    <input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-brand-500 uppercase mb-1">價格 ($)</label>
                      <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm" />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={productForm.inStock} onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })} className="accent-brand-600 w-4 h-4" />
                        <span className="text-sm text-brand-800">庫存中</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-1">描述</label>
                    <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={2} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-1">圖片</label>
                    <input type="text" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm" />
                  </div>
                  <button onClick={handleSaveProduct} className="w-full bg-brand-800 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-brand-200 mt-2">
                    <Save size={18} /> 儲存商品
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="bg-white p-3 rounded-xl border border-brand-100 shadow-sm flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={product.image} alt={product.name} className={`w-full h-full object-cover ${!product.inStock ? 'opacity-50' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-brand-900 truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="font-semibold text-brand-700">${product.price}</span>
                      <span className={product.inStock ? 'text-green-600' : 'text-red-500'}>{product.inStock ? '庫存中' : '售完'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditProduct(product)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === 'promotions' && (
          <>
            {!isAddingPromo && !editingPromoId && (
              <button onClick={() => { setIsAddingPromo(true); setEditingPromoId(null); setPromoForm(initialPromoForm); }} className="w-full bg-white border-2 border-dashed border-brand-300 text-brand-500 rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-brand-50 transition-all mb-6">
                <Plus size={20} /> <span>新增特惠活動</span>
              </button>
            )}

            {(isAddingPromo || editingPromoId) && (
              <div className="bg-white rounded-xl shadow-lg border border-brand-200 p-5 mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b border-brand-100 pb-2">
                  <h3 className="font-medium text-brand-900">{isAddingPromo ? '新增活動' : '編輯活動'}</h3>
                  <button onClick={() => { setEditingPromoId(null); setIsAddingPromo(false); }} className="text-brand-400"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-1">主標題</label>
                    <input type="text" value={promoForm.title} onChange={e => setPromoForm({ ...promoForm, title: e.target.value })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm" placeholder="例如: 冬季限定" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-1">副標題 / 描述</label>
                    <input type="text" value={promoForm.description} onChange={e => setPromoForm({ ...promoForm, description: e.target.value })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm" placeholder="例如: 全面 8 折起" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-500 uppercase mb-1">標籤 (Label)</label>
                      <input type="text" value={promoForm.label} onChange={e => setPromoForm({ ...promoForm, label: e.target.value })} className="w-full bg-brand-50 border border-brand-200 rounded-lg p-3 text-sm" placeholder="例如: 當季特惠" />
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={promoForm.active} onChange={e => setPromoForm({ ...promoForm, active: e.target.checked })} className="accent-brand-600 w-4 h-4" />
                        <span className="text-sm text-brand-800">啟用中</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-1">圖片連結</label>
                    <div className="flex gap-3 items-center">
                      <div className="relative flex-1">
                        <ImageIcon size={16} className="absolute left-3 top-2.5 text-brand-300" />
                        <input
                          type="text"
                          value={promoForm.image}
                          onChange={e => setPromoForm({ ...promoForm, image: e.target.value })}
                          className="w-full bg-brand-50 border border-brand-200 rounded-lg p-2 pl-9 text-sm"
                        />
                      </div>
                      <div className="w-16 h-10 rounded-lg bg-brand-50 overflow-hidden border border-brand-200 shrink-0">
                        <img src={promoForm.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSavePromo} className="w-full bg-brand-800 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-brand-200 mt-2">
                    <Save size={18} /> 儲存活動
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {promotions.map(promo => (
                <div key={promo.id} className={`bg-white p-4 rounded-xl border ${promo.active ? 'border-brand-100' : 'border-gray-100 bg-gray-50'} shadow-sm`}>
                  <div className="flex gap-4">
                    <div className="w-24 aspect-video bg-gray-200 rounded-lg overflow-hidden shrink-0">
                      <img src={promo.image} alt={promo.title} className={`w-full h-full object-cover ${!promo.active ? 'opacity-50' : ''}`} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        {promo.label && <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded">{promo.label}</span>}
                        {!promo.active && <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">停用</span>}
                      </div>
                      <h3 className="font-medium text-brand-900 truncate">{promo.title}</h3>
                      <p className="text-xs text-brand-500 truncate">{promo.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <button onClick={() => handleEditPromo(promo)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeletePromo(promo.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 flex gap-4 items-start">
              <div className="p-3 bg-white rounded-full text-brand-600 shadow-sm">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-900">開發設計規格書</h3>
                <p className="text-xs text-brand-500 mt-1 mb-3">
                  包含系統架構、資料庫模型、技術堆疊與 Context 狀態管理的詳細技術文件。
                </p>
                <button
                  onClick={() => handleDownloadDoc(DEV_SPEC_MD, 'Mule_Eyelash_Dev_Spec.md')}
                  className="bg-brand-800 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
                >
                  <Download size={14} /> 下載 Markdown
                </button>
              </div>
            </div>

            <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 flex gap-4 items-start">
              <div className="p-3 bg-white rounded-full text-brand-600 shadow-sm">
                <BookOpen size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-900">使用者操作手冊</h3>
                <p className="text-xs text-brand-500 mt-1 mb-3">
                  提供商家後台各項功能的操作指引，包含預約處理、商品上架與人員排班設定。
                </p>
                <button
                  onClick={() => handleDownloadDoc(USER_MANUAL_MD, 'Mule_Eyelash_User_Manual.md')}
                  className="bg-brand-800 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
                >
                  <Download size={14} /> 下載 Markdown
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;