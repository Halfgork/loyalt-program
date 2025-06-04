'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Plus, Clock, Gift } from 'lucide-react';
import MerchantQRCode from '@/components/MerchantQRCode';

export default function MerchantPage() {
  const [qrConfig, setQrConfig] = useState({
    merchantId: 'store_001',
    pointsAmount: 100,
    productId: '',
    description: '',
    validHours: 24
  });

  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => {
    if (qrConfig.pointsAmount > 0) {
      setShowQR(true);
    }
  };

  const getValidUntil = () => {
    const now = new Date();
    return new Date(now.getTime() + qrConfig.validHours * 60 * 60 * 1000);
  };

  const presetConfigs = [
    { label: 'Coffee Purchase', points: 50, productId: 'coffee_regular', description: 'Regular Coffee Purchase' },
    { label: 'Lunch Special', points: 150, productId: 'lunch_special', description: 'Daily Lunch Special' },
    { label: 'Happy Hour', points: 200, productId: 'happy_hour', description: 'Happy Hour Bonus' },
    { label: 'Premium Item', points: 300, productId: 'premium_item', description: 'Premium Product Purchase' },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <Store className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">Merchant Portal</h1>
              <p className="text-gray-400">Generate QR codes for customer point earning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-game"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-primary-500" />
              Configure QR Code
            </h2>

            <div className="space-y-6">
              {/* Merchant ID */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Merchant ID
                </label>
                <input
                  type="text"
                  value={qrConfig.merchantId}
                  onChange={(e) => setQrConfig({...qrConfig, merchantId: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="store_001"
                />
              </div>

              {/* Points Amount */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Points Amount
                </label>
                <input
                  type="number"
                  value={qrConfig.pointsAmount}
                  onChange={(e) => setQrConfig({...qrConfig, pointsAmount: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="100"
                  min="1"
                />
              </div>

              {/* Product ID */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Product ID (Optional)
                </label>
                <input
                  type="text"
                  value={qrConfig.productId}
                  onChange={(e) => setQrConfig({...qrConfig, productId: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="product_123"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={qrConfig.description}
                  onChange={(e) => setQrConfig({...qrConfig, description: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Purchase description..."
                  rows={3}
                />
              </div>

              {/* Valid Hours */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Valid for (hours)
                </label>
                <select
                  value={qrConfig.validHours}
                  onChange={(e) => setQrConfig({...qrConfig, validHours: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={1}>1 Hour</option>
                  <option value={4}>4 Hours</option>
                  <option value={8}>8 Hours</option>
                  <option value={24}>24 Hours</option>
                  <option value={72}>3 Days</option>
                  <option value={168}>1 Week</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateQR}
                disabled={qrConfig.pointsAmount <= 0}
                className="w-full btn-game disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Gift className="h-4 w-4 mr-2" />
                Generate QR Code
              </button>
            </div>

            {/* Preset Configurations */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Quick Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {presetConfigs.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setQrConfig({
                      ...qrConfig,
                      pointsAmount: preset.points,
                      productId: preset.productId,
                      description: preset.description
                    })}
                    className="p-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500 rounded-lg text-left transition-all"
                  >
                    <div className="text-white font-medium text-sm">{preset.label}</div>
                    <div className="text-primary-400 text-sm">{preset.points} PTS</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* QR Code Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {showQR ? (
              <MerchantQRCode
                merchantId={qrConfig.merchantId}
                pointsAmount={qrConfig.pointsAmount}
                productId={qrConfig.productId || undefined}
                description={qrConfig.description || undefined}
                validUntil={getValidUntil()}
                onScan={(data) => {
                  console.log('QR Code scanned:', data);
                }}
              />
            ) : (
              <div className="card-game h-full flex items-center justify-center text-center">
                <div>
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">QR Code Preview</h3>
                  <p className="text-gray-400 mb-4">
                    Configure the settings and click "Generate QR Code" to create a scannable code for customers.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>• Customers scan to earn loyalty points</p>
                    <p>• Secure blockchain-based validation</p>
                    <p>• Real-time point crediting</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 