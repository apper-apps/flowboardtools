import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const DealModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  deal = null,
  stages = []
}) => {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    stage: "New Lead",
    contactName: "",
    contactEmail: "",
    expectedCloseDate: "",
    priority: "medium",
    notes: ""
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || "",
        value: deal.value || "",
        stage: deal.stage || "New Lead",
        contactName: deal.contactName || "",
        contactEmail: deal.contactEmail || "",
        expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : "",
        priority: deal.priority || "medium",
        notes: deal.notes || ""
      })
    } else {
      setFormData({
        name: "",
        value: "",
        stage: "New Lead",
        contactName: "",
        contactEmail: "",
        expectedCloseDate: "",
        priority: "medium",
        notes: ""
      })
    }
    setErrors({})
  }, [deal, isOpen])

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required"
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0"
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required"
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address"
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const dealData = {
      ...formData,
      value: parseFloat(formData.value),
      expectedCloseDate: new Date(formData.expectedCloseDate).toISOString()
    }

    onSave(dealData)
  }

  const handleClose = () => {
    setFormData({
      name: "",
      value: "",
      stage: "New Lead",
      contactName: "",
      contactEmail: "",
      expectedCloseDate: "",
      priority: "medium",
      notes: ""
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {deal ? "Edit Deal" : "New Deal"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Deal Name"
            required
            value={formData.name}
            onChange={handleChange("name")}
            error={errors.name}
            placeholder="Enter deal name"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Deal Value"
              required
              type="number"
              min="0"
              step="0.01"
              value={formData.value}
              onChange={handleChange("value")}
              error={errors.value}
              placeholder="0.00"
            />

            <FormField
              label="Stage"
              required
              error={errors.stage}
            >
              <select
                value={formData.stage}
                onChange={handleChange("stage")}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.name}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            label="Contact Name"
            required
            value={formData.contactName}
            onChange={handleChange("contactName")}
            error={errors.contactName}
            placeholder="Enter contact name"
          />

          <FormField
            label="Contact Email"
            required
            type="email"
            value={formData.contactEmail}
            onChange={handleChange("contactEmail")}
            error={errors.contactEmail}
            placeholder="contact@company.com"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Expected Close Date"
              required
              type="date"
              value={formData.expectedCloseDate}
              onChange={handleChange("expectedCloseDate")}
              error={errors.expectedCloseDate}
            />

            <FormField
              label="Priority"
              required
              error={errors.priority}
            >
              <select
                value={formData.priority}
                onChange={handleChange("priority")}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </FormField>
          </div>

          <FormField
            label="Notes"
            error={errors.notes}
          >
            <textarea
              value={formData.notes}
              onChange={handleChange("notes")}
              placeholder="Add notes about this deal..."
              rows={3}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </FormField>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {deal ? "Update Deal" : "Create Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DealModal