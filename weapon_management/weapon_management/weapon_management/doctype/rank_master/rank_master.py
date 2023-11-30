# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RankMaster(Document):
    def validate(self):
        if self.rank_id:
            normalized_rank_id = self.normalize_rank_id(self.rank_id)
            duplicate_rank = frappe.db.get_value(
                "Rank Master",
                {
                    "rank_id": normalized_rank_id,
                    "name": ("!=", self.name)
                }
            )
            if duplicate_rank:
                frappe.throw(f"Rank ID '{self.rank_id}' already exists. Please choose a different Rank ID.")

    def normalize_rank_id(self, rank_id):   
        normalized_rank_id = rank_id.replace(".", "").upper()
        return normalized_rank_id
