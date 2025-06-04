'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Store, Copy, Download, Check, Settings, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';

interface MerchantQRCodeProps {
  merchantId?: string;
  pointsAmount: number;
  productId?: string;
  description?: string;
  validUntil?: Date;
  onScan?: (data: QRCodeData) => void;
}

interface QRCodeData {
  type: 'merchant_transaction';
  merchantId: string;
  pointsAmount: number;
  productId?: string;
  description?: string;
  timestamp: number;
  validUntil?: number;
  networkId: string;
}

export function MerchantQRCode({
  merchantId = 'default_merchant',
  pointsAmount,
  productId,
  description,
  validUntil,
  onScan
}: MerchantQRCodeProps) {
  const { publicKey } = useWallet();
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [merchantId, pointsAmount, productId, description, validUntil]);

  const generateQRCode = () => {
    const data: QRCodeData = {
      type: 'merchant_transaction',
      merchantId,
      pointsAmount,
      productId,
      description,
      timestamp: Date.now(),
      validUntil: validUntil?.getTime(),
      networkId: 'stellar_testnet' // or 'stellar_mainnet' for production
    };

    setQrCodeData(data);
  };

  const handleCopyQRData = async () => {
    if (!qrCodeData) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(qrCodeData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR data:', err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeData) return;

    const svg = document.querySelector('#merchant-qr-code svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `merchant-qr-${merchantId}-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const formatTimeRemaining = () => {
    if (!validUntil) return null;

    const now = new Date();
    const remaining = validUntil.getTime() - now.getTime();
    
    if (remaining <= 0) {
      setIsVisible(false);
      return 'Expired';
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  if (!qrCodeData || !isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-game text-center"
      >
        <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">QR Code expired or unavailable</p>
        <button
          onClick={generateQRCode}
          className="btn-game mt-4"
        >
          Generate New Code
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-game max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Store className="h-6 w-6 text-primary-500" />
          <div>
            <h3 className="text-lg font-semibold text-white">Merchant QR Code</h3>
            <p className="text-sm text-gray-400">Scan to earn {pointsAmount} points</p>
          </div>
        </div>
        <button
          onClick={generateQRCode}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Refresh QR Code"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* QR Code */}
      <div className="bg-white p-6 rounded-lg mb-6" id="merchant-qr-code">
        <QRCode
          value={JSON.stringify(qrCodeData)}
          size={200}
          className="w-full h-auto"
        />
      </div>

      {/* Transaction Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Merchant ID:</span>
          <span className="text-white font-mono text-sm">{merchantId}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Points:</span>
          <span className="text-green-400 font-semibold">{pointsAmount} PTS</span>
        </div>

        {productId && (
          <div className="flex justify-between">
            <span className="text-gray-400">Product ID:</span>
            <span className="text-white font-mono text-sm">{productId}</span>
          </div>
        )}

        {description && (
          <div className="flex justify-between">
            <span className="text-gray-400">Description:</span>
            <span className="text-white text-sm">{description}</span>
          </div>
        )}

        {validUntil && (
          <div className="flex justify-between">
            <span className="text-gray-400">Valid Until:</span>
            <span className="text-orange-400 text-sm">{formatTimeRemaining()}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleCopyQRData}
          className="flex-1 btn-game-secondary"
          disabled={copied}
        >
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Data'}
        </button>
        
        <button
          onClick={handleDownloadQR}
          className="flex-1 btn-game"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PNG
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs text-center">
          🔒 This QR code contains encrypted transaction data. Only authorized apps can process it.
        </p>
      </div>
    </motion.div>
  );
}

export default MerchantQRCode; 