import requests
import frappe




@frappe.whitelist()
def get_latest_rfid_data():
    url = "http://192.168.10.21:5000/get_latest_rfid_data"

    try:
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            data = response.json()  # Assuming the response is in JSON format
            # frappe.msgprint("Data from API: {}".format(data))
            return data
        else:
            print("Failed to retrieve data. Status code:", response.status_code)
            frappe.msgprint("Failed to retrieve data. Status code: {}".format(response.status_code))
            # Handle the case where the request was not successful

    except requests.RequestException as e:
        print("Error making request:", e)
        frappe.msgprint("Error making request: {}".format(e))
        # Handle the case where an exception occurred
