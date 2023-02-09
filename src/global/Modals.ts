import NiceModal from "@ebay/nice-modal-react"
import { ConfirmationModal } from "../layouts/re-useable/modals/ConfirmationModal"
import EditFoodModal from "../layouts/view-foods/components/EditFoodModal"
import AddMealPlanMealModal from "../layouts/view-meal-plan/components/AddMealPlanMealModal"
import EditMealPlanMetaDataModal from "../layouts/view-meal-plan/components/EditMealPlanModal"
import EditMealModal from "../layouts/view-meals/components/EditMealModal"

NiceModal.register("edit-food-modal", EditFoodModal)
NiceModal.register("edit-meal-modal", EditMealModal)
NiceModal.register("edit-meal-plan-meta-data-modal", EditMealPlanMetaDataModal)
NiceModal.register("add-meal-plan-meal-modal", AddMealPlanMealModal)
NiceModal.register("confirmation-modal", ConfirmationModal)
