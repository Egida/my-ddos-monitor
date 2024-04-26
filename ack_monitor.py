from scapy.all import *
import time
import requests
import threading
from dotenv import load_dotenv
import os

# 加载 .env 文件的环境变量
load_dotenv()

def send_telegram_message(message):
    token = os.getenv('TELEGRAM_TOKEN')
    chat_id = os.getenv('CHAT_ID')
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = {"chat_id": chat_id, "text": message}
    response = requests.post(url, data=data)
    print(response.text)

def ack_monitor():
    target_ip = os.getenv('TARGET_IP', '127.0.0.1')
    target_port = int(os.getenv('TARGET_PORT', 80))
    threshold = int(os.getenv('THRESHOLD', 100))
    check_interval = 10  # 检查间隔（秒）
    ack_count = 0

    def count_ack(packet):
        nonlocal ack_count
        if packet.haslayer(TCP) and packet[TCP].flags == 'A' and packet[IP].dst == target_ip and packet[TCP].dport == target_port:
            ack_count += 1

    def report():
        nonlocal ack_count
        if ack_count > threshold:
            message = f"High ACK traffic detected: {ack_count} ACKs in last {check_interval} seconds"
            print(message)
            send_telegram_message(message)
        ack_count = 0
        threading.Timer(check_interval, report).start()

    report()
    sniff(filter=f"tcp and ip dst {target_ip} and port {target_port}", prn=count_ack, store=False)

if __name__ == "__main__":
    ack_monitor()
