import React from 'react';
import { FiPrinter } from 'react-icons/fi';
import printJS from 'print-js';
import './receipt.css';

function Receipt({
  orderNumber = '0001',
  date = '03-07-2025',
  time = '11:53 am',
  items = [
    { quantity: 2, name: 'Caramel Dream Latte (1 Regular, 1 Medium)', price: 300 }
  ],
  total = 300,
  cash = 500,
  change = 200,
  onStartNewOrder
}) {
  const handlePrint = () => {
    printJS({
      printable: 'print-receipt',
      type: 'html',
      style: `
        body { font-family: 'Poppins', sans-serif; }
        .print-receipt-box { max-width: 320px; margin: 0 auto; border: 1px solid #222; padding: 16px; }
        .print-title { font-size: 1.2rem; font-weight: bold; text-align: center; margin-bottom: 8px; }
        .print-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .print-hr { border: none; border-top: 1px dashed #222; margin: 8px 0; }
        .print-queue { font-weight: bold; text-align: center; margin-top: 10px; }
      `
    });
  };

  return (
    <div className="receipt-bg">
      <div className="receipt-main-box">
        <div className="receipt-confirm">Order confirmed. Please prepare order.</div>
        <div className="receipt-box">
          <div className="receipt-header-row">
            <span className="receipt-title">Receipt:</span>
            <span className="receipt-date-block">
              <span className="receipt-date">{date}</span>
              <span className="receipt-time">{time}</span>
            </span>
          </div>
          <div className="receipt-table-head" style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 80px', alignItems: 'center', gap: '16px', marginBottom: 10 }}>
            <span className="receipt-th" style={{ paddingRight: 8 }}>Qty</span>
            <span className="receipt-th">Product</span>
            <span className="receipt-th" style={{ textAlign: 'right' }}>Price</span>
          </div>
          {items.map((item, idx) => (
            <div className="receipt-table-row" key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 80px', alignItems: 'flex-start', gap: '16px', marginBottom: 10 }}>
              <span className="receipt-td" style={{ paddingRight: 8 }}>{item.quantity}x</span>
              <span className="receipt-td" style={{ wordBreak: 'break-word', whiteSpace: 'normal', paddingRight: 8 }}>{item.name}</span>
              <span className="receipt-td" style={{ textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>₱{Number(item.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="receipt-dotted" />
          <div className="receipt-table-row" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', alignItems: 'center', gap: '8px', margin: '10px 0 0 0' }}>
            <span className="receipt-td-bold">Total Amount:</span>
            <span className="receipt-td"></span>
            <span className="receipt-td-bold" style={{ textAlign: 'right' }}>₱{Number(total).toFixed(2)}</span>
          </div>
          <div className="receipt-table-row" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            <span className="receipt-td-bold">Cash:</span>
            <span className="receipt-td"></span>
            <span className="receipt-td-bold" style={{ textAlign: 'right' }}>₱{Number(cash).toFixed(2)}</span>
          </div>
          <div className="receipt-table-row" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', alignItems: 'center', gap: '8px', margin: '4px 0 10px 0' }}>
            <span className="receipt-td-bold">Change:</span>
            <span className="receipt-td"></span>
            <span className="receipt-td-bold" style={{ textAlign: 'right' }}>₱{Number(change).toFixed(2)}</span>
          </div>
          <div className="receipt-dotted" />
          <div className="receipt-queue">The Queue Number: <span className="receipt-queue-num">#{orderNumber}</span></div>
          <div className="receipt-print-row">
            <span className="receipt-print-label">Print Receipt:</span>
            <button className="receipt-print-btn" onClick={handlePrint}><FiPrinter size={22} /></button>
          </div>
        </div>
      </div>
      <button className="receipt-neworder-btn" onClick={onStartNewOrder}>Start New Order</button>
      {/* Hidden printable receipt template, now off-screen and without logo */}
      <div id="print-receipt" style={{ position: 'absolute', left: '-9999px', top: 0, width: '350px', background: '#fff', color: '#222', fontFamily: 'Poppins, sans-serif', padding: 0, margin: 0 }}>
        <div className="print-receipt-box" style={{ border: '2px solid #222', borderRadius: 8, padding: 18, maxWidth: 320, margin: '0 auto' }}>
          <div className="print-title" style={{ fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>AJH Bread & Beans</div>
          <div className="print-row" style={{ marginBottom: 6 }}><span>Date:</span><span>{date}</span></div>
          <div className="print-row" style={{ marginBottom: 12 }}><span>Time:</span><span>{time}</span></div>
          <hr className="print-hr" style={{ border: 'none', borderTop: '1.5px dashed #222', margin: '10px 0' }} />
          <div className="print-row" style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: 8, display: 'flex', gap: 8 }}>
            <span style={{ width: 40 }}>Qty</span><span style={{ flex: 1, textAlign: 'left' }}>Product</span><span style={{ width: 70, textAlign: 'right' }}>Price</span>
          </div>
          {items.map((item, idx) => (
            <div className="print-row" key={idx} style={{ fontSize: '1rem', marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ width: 40, paddingTop: 2 }}>{item.quantity}x</span>
              <span style={{ flex: 1, textAlign: 'left', maxWidth: 120, display: 'block', wordBreak: 'break-word', whiteSpace: 'normal', paddingRight: 8 }}>{item.name}</span>
              <span style={{ width: 70, textAlign: 'right', fontWeight: 500, alignSelf: 'flex-start', whiteSpace: 'nowrap', marginTop: 0 }}>{`₱${Number(item.price).toFixed(2)}`}</span>
            </div>
          ))}
          <hr className="print-hr" style={{ border: 'none', borderTop: '1.5px dashed #222', margin: '10px 0' }} />
          <div className="print-row" style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: 4, display: 'flex', gap: 8 }}><span>Total:</span><span style={{ flex: 1 }}></span><span style={{ textAlign: 'right', width: 70 }}>₱{Number(total).toFixed(2)}</span></div>
          <div className="print-row" style={{ marginBottom: 2, display: 'flex', gap: 8 }}><span>Cash:</span><span style={{ flex: 1 }}></span><span style={{ textAlign: 'right', width: 70 }}>₱{Number(cash).toFixed(2)}</span></div>
          <div className="print-row" style={{ marginBottom: 2, display: 'flex', gap: 8 }}><span>Change:</span><span style={{ flex: 1 }}></span><span style={{ textAlign: 'right', width: 70 }}>₱{Number(change).toFixed(2)}</span></div>
          <hr className="print-hr" style={{ border: 'none', borderTop: '1.5px dashed #222', margin: '10px 0' }} />
          <div className="print-queue" style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', marginTop: 12 }}>
            Queue #: <b style={{ fontSize: '1.3rem', color: '#2DFB7B' }}>#{orderNumber}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
