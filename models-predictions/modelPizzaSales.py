import pandas as pd

# Cargar los datos (suponiendo que tienes un archivo CSV)
df = pd.read_csv('Pizza_Sales.csv')

# Mostrar las primeras filas del DataFrame
print(df.head())

# Resumen de los datos
print(df.info())
print(df.describe())

# Convertir las columnas de fecha y hora a tipo datetime con el formato correcto
df['order_date'] = pd.to_datetime(df['order_date'], format='%d/%m/%Y')
df['order_time'] = pd.to_datetime(df['order_time'], format='%H:%M:%S').dt.time

# Combinar fecha y hora en una sola columna datetime
df['fecha_hora'] = pd.to_datetime(df['order_date'].astype(str) + ' ' + df['order_time'].astype(str))

# Extraer características de fecha y hora
df['dia_semana'] = df['fecha_hora'].dt.dayofweek  # Lunes=0, Domingo=6
df['hora'] = df['fecha_hora'].dt.hour
df['mes'] = df['fecha_hora'].dt.month

# Verificar los cambios
print(df.head())

import matplotlib.pyplot as plt
import seaborn as sns

# Ventas por día de la semana
ventas_por_dia = df.groupby('dia_semana').size()
sns.barplot(x=ventas_por_dia.index, y=ventas_por_dia.values)
plt.xlabel('Día de la Semana')
plt.ylabel('Número de Ventas')
plt.title('Ventas por Día de la Semana')
plt.show()

# Ventas por hora del día
ventas_por_hora = df.groupby('hora').size()
sns.barplot(x=ventas_por_hora.index, y=ventas_por_hora.values)
plt.xlabel('Hora del Día')
plt.ylabel('Número de Ventas')
plt.title('Ventas por Hora del Día')
plt.show()

# Características (features) y objetivo (target)
X = df[['dia_semana', 'hora', 'mes']]
y = df['pizza_name']  # Actualiza a la columna correcta

# Convertir la variable objetivo a numérica
y = y.astype('category')
pizza_categories = dict(enumerate(y.cat.categories))  # Guardar el mapeo de códigos a nombres de pizzas
y = y.cat.codes  # Convertir a códigos numéricos

# Dividir los datos
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Entrenar el modelo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Hacer predicciones
y_pred = model.predict(X_test)

# Evaluar el modelo
print(classification_report(y_test, y_pred))
print('Accuracy:', accuracy_score(y_test, y_pred))

# Ejemplo de predicción para un nuevo día
nuevo_dia = pd.DataFrame({'dia_semana': [2], 'hora': [18], 'mes': [6]})  # Miércoles a las 18:00 en junio
prediccion = model.predict(nuevo_dia)
nombre_pizza_predicha = pizza_categories[prediccion[0]]  # Convertir el código de pizza al nombre

print(f'Tipo de pizza más probable a vender: {nombre_pizza_predicha}')
