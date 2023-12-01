


import socket
import re
from flask import Flask, jsonify
from flask_cors import CORS

class RFIDListener:
    def __init__(self, server_ip='192.168.10.21', server_port=12346, allowed_ip='192.168.10.107'):
        self.server_ip = server_ip
        self.server_port = server_port
    
        self.allowed_ip = allowed_ip
        self.connected_clients = []
        self.buffer_data = {}
        self.latest_rfid_data = None

    def start_server(self):
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.bind((self.server_ip, self.server_port))
            self.server_socket.listen()
            print(f"Server Listening on {self.server_ip}:{self.server_port} for RFID Reader")

            self.server_socket.setblocking(False)
            while True:
                self.handle_connection()
                for client_socket in self.connected_clients:
                    self.process_data(client_socket)
        except OSError as e:
            print(f"Error starting server: {e}")
            raise
        except KeyboardInterrupt:
            self.stop_server()

    def handle_connection(self):
        try:
            client_socket, client_address = self.server_socket.accept()
            if client_address[0] == self.allowed_ip:
                print(f"Connection established with RFID Reader at {client_address}")
                self.connected_clients.append(client_socket)
                self.buffer_data[client_socket] = b""  # Initialize buffer for the client
            else:
                print(f"Connection From {client_address} Rejected. Expected connection from RFID Reader at {self.allowed_ip}")
                client_socket.close()
        except socket.error:
            pass

    def process_data(self, client_socket):
        try:
            data = client_socket.recv(2048)
            if data:
                self.buffer_data[client_socket] += data
                while b'\x1D' in self.buffer_data[client_socket]:
                    message, self.buffer_data[client_socket] = self.buffer_data[client_socket].split(b'\x1D', 1)
                    hex_message = ''.join([f'{byte:02X}' for byte in message])
                    print(f"{hex_message} -- New Data")
                    self.extract_rfid_data(hex_message)
        except socket.error:
            print(f"RFID reader at {client_socket.getpeername()} disconnected")
            self.connected_clients.remove(client_socket)
            del self.buffer_data[client_socket]
            client_socket.close()

    def extract_rfid_data(self, hex_message):
        self.latest_rfid_data = None
        if hex_message:
            pattern = re.compile(r'^[0-9A-Fa-f]{30}(.+)[0-9A-Fa-f]{4}$')
            match = pattern.match(hex_message)
            if match:
                print(f"Match found: {match.group(1)}")
                self.latest_rfid_data = match.group(1)
            else:
                print("No match found")

    def stop_server(self):
        print("\nStopping server.")
        for client_socket in self.connected_clients:
            client_socket.close()
        self.server_socket.close()
        print("Server closed.")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
rfid_listener_instance = RFIDListener()

@app.route('/get_latest_rfid_data', methods=['GET'])
def get_latest_rfid_data():
    return jsonify({'latest_rfid_data': rfid_listener_instance.latest_rfid_data})

if __name__ == '__main__':
    # Start RFID listener in a separate thread
    import threading
    rfid_listener_thread = threading.Thread(target=rfid_listener_instance.start_server)
    rfid_listener_thread.start()

    # Start Flask server in the main thread
    app.run(host='0.0.0.0', port=5000)  # Adjust host and port as needed

####################################

# import socket
# import re
# import frappe
# from frappe.utils.background_jobs import enqueue

# connected_clients = []
# buffer_data = {}  # Store incomplete messages for each connected client
# latest_rfid_data = None  # Global variable to store the latest RFID data


# @frappe.whitelist()
# def start_rfid_listener():
#     job_name = "rfid_listener"
#     if frappe.get_all("Background Job", filters={"name": job_name, "status": "queued"}):
#         return "RFID listener is already running."

#     enqueue("weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.rfid_reader.rfid_listener", job_name=job_name)
#     return "RFID listener started successfully."


# @frappe.whitelist()
# def stop_rfid_listener():
#     job_name = "rfid_listener"
#     frappe.enqueue("frappe.utils.background_jobs.cancel_all", queue="long", timeout=120)
#     return "RFID listener stopped."


# @frappe.whitelist()
# def get_latest_rfid_data():
#     return latest_rfid_data


# @frappe.whitelist()
# def clear_latest_rfid_data():
#     global latest_rfid_data
#     latest_rfid_data = None
#     return "Latest RFID data cleared."


# def rfid_listener():
#     global latest_rfid_data  # Use the global variable

#     server_ip = '192.168.20.106'
#     server_port = 12346

#     server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

#     try:
#         server_socket.bind((server_ip, server_port))
#         server_socket.listen()
#         print(f"Server Listening on {server_ip}:{server_port} for RFID Reader")

#         server_socket.setblocking(False)

#         while True:
#             try:
#                 client_socket, client_address = server_socket.accept()
#                 if client_address[0] == '192.168.10.107':
#                     print(f"Connection established with RFID Reader at {client_address}")
#                     connected_clients.append(client_socket)
#                     buffer_data[client_socket] = b""  # Initialize buffer for the client
#                 else:
#                     print(f"Connection From {client_address} Rejected. Expected connection from RFID Reader at 192.168.10.107")
#                     client_socket.close()
#             except socket.error:
#                 pass

#             for client_socket in connected_clients:
#                 try:
#                     data = client_socket.recv(1024)
#                     if data:
#                         buffer_data[client_socket] += data
#                         while b'\x1D' in buffer_data[client_socket]:
#                             message, buffer_data[client_socket] = buffer_data[client_socket].split(b'\x1D', 1)
#                             hex_message = ''.join([f'{byte:02X}' for byte in message])
#                             print(f"{hex_message} -- New Data")

#                             # Concatenate the first two hex messages into a single string
#                             if hex_message:
#                                 # Apply the regex pattern
#                                 pattern = re.compile(r'^[0-9A-Fa-f]{30}(.+)[0-9A-Fa-f]{4}$')
#                                 match = pattern.match(hex_message)
#                                 if match:
#                                     print(f"Match found: {match.group(1)}")
#                                     # Store the matched data in the global variable
#                                     latest_rfid_data = match.group(1)
#                                 else:
#                                     print("No match found")

#                 except socket.error:
#                     print(f"RFID reader at {client_socket.getpeername()} disconnected")
#                     connected_clients.remove(client_socket)
#                     del buffer_data[client_socket]
#                     client_socket.close()

#     except KeyboardInterrupt:
#         print("\nKeyboardInterrupt: Closing server.")
#         for client_socket in connected_clients:
#             client_socket.close()
#         server_socket.close()
#         print("Server closed.")